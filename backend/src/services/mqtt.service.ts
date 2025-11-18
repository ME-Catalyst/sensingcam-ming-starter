import mqtt from 'mqtt';
import { config } from '../config';
import { logger } from '../utils/logger';
import { MQTTMessage } from '../types';

type MessageHandler = (message: MQTTMessage) => void;

class MQTTService {
  private client: mqtt.MqttClient | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private isConnected = false;

  /**
   * Connect to MQTT broker
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.client = mqtt.connect(config.mqtt.brokerUrl, {
          clientId: config.mqtt.clientId,
          username: config.mqtt.username,
          password: config.mqtt.password,
          clean: true,
          reconnectPeriod: 5000,
        });

        this.client.on('connect', () => {
          logger.info('Connected to MQTT broker');
          this.isConnected = true;

          // Subscribe to default topics
          this.subscribe(config.mqtt.topics.factoryEvents);
          this.subscribe(config.mqtt.topics.frigateEvents);

          resolve();
        });

        this.client.on('error', error => {
          logger.error('MQTT connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        this.client.on('message', (topic, payload) => {
          this.handleMessage(topic, payload);
        });

        this.client.on('reconnect', () => {
          logger.info('Reconnecting to MQTT broker...');
        });

        this.client.on('close', () => {
          logger.warn('MQTT connection closed');
          this.isConnected = false;
        });
      } catch (error) {
        logger.error('Failed to connect to MQTT:', error);
        reject(error);
      }
    });
  }

  /**
   * Subscribe to a topic
   */
  subscribe(topic: string): void {
    if (!this.client) {
      throw new Error('MQTT client not connected');
    }

    this.client.subscribe(topic, error => {
      if (error) {
        logger.error(`Failed to subscribe to ${topic}:`, error);
      } else {
        logger.info(`Subscribed to MQTT topic: ${topic}`);
      }
    });
  }

  /**
   * Unsubscribe from a topic
   */
  unsubscribe(topic: string): void {
    if (!this.client) {
      throw new Error('MQTT client not connected');
    }

    this.client.unsubscribe(topic, error => {
      if (error) {
        logger.error(`Failed to unsubscribe from ${topic}:`, error);
      } else {
        logger.info(`Unsubscribed from MQTT topic: ${topic}`);
      }
    });
  }

  /**
   * Publish a message to a topic
   */
  publish(topic: string, message: any): void {
    if (!this.client) {
      throw new Error('MQTT client not connected');
    }

    const payload = typeof message === 'string' ? message : JSON.stringify(message);

    this.client.publish(topic, payload, { qos: 1 }, error => {
      if (error) {
        logger.error(`Failed to publish to ${topic}:`, error);
      } else {
        logger.debug(`Published to MQTT topic ${topic}:`, message);
      }
    });
  }

  /**
   * Register a message handler for a topic pattern
   */
  onMessage(topicPattern: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(topicPattern)) {
      this.messageHandlers.set(topicPattern, []);
    }
    this.messageHandlers.get(topicPattern)!.push(handler);
  }

  /**
   * Handle incoming MQTT messages
   */
  private handleMessage(topic: string, payload: Buffer): void {
    try {
      const message: MQTTMessage = {
        topic,
        payload: JSON.parse(payload.toString()),
        timestamp: new Date(),
      };

      logger.debug(`Received MQTT message on ${topic}:`, message.payload);

      // Call all matching handlers
      this.messageHandlers.forEach((handlers, pattern) => {
        if (this.topicMatches(topic, pattern)) {
          handlers.forEach(handler => {
            try {
              handler(message);
            } catch (error) {
              logger.error(`Error in message handler for ${pattern}:`, error);
            }
          });
        }
      });
    } catch (error) {
      logger.error('Failed to parse MQTT message:', error);
    }
  }

  /**
   * Check if topic matches pattern (supports MQTT wildcards)
   */
  private topicMatches(topic: string, pattern: string): boolean {
    const topicParts = topic.split('/');
    const patternParts = pattern.split('/');

    if (patternParts.includes('#')) {
      const hashIndex = patternParts.indexOf('#');
      return topicParts.slice(0, hashIndex).every((part, i) => {
        return patternParts[i] === '+' || patternParts[i] === part;
      });
    }

    if (topicParts.length !== patternParts.length) {
      return false;
    }

    return topicParts.every((part, i) => {
      return patternParts[i] === '+' || patternParts[i] === part;
    });
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      clientId: config.mqtt.clientId,
      brokerUrl: config.mqtt.brokerUrl,
    };
  }

  /**
   * Disconnect from MQTT broker
   */
  async disconnect(): Promise<void> {
    return new Promise(resolve => {
      if (this.client) {
        this.client.end(false, {}, () => {
          logger.info('Disconnected from MQTT broker');
          this.isConnected = false;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export const mqttService = new MQTTService();
