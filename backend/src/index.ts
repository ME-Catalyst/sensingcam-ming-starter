import App from './app';
import { config, validateConfig } from './config';
import { logger } from './utils/logger';
import { mqttService } from './services/mqtt.service';
import { influxDBService } from './services/influxdb.service';
import { initializeDefaultUser } from './controllers/auth.controller';

async function bootstrap() {
  try {
    // Validate configuration
    logger.info('Validating configuration...');
    validateConfig();

    // Initialize default admin user
    await initializeDefaultUser();

    // Create app instance
    const app = new App();

    // Connect to MQTT broker
    logger.info('Connecting to MQTT broker...');
    await mqttService.connect();

    // Set up MQTT event handlers
    mqttService.onMessage(config.mqtt.topics.factoryEvents, message => {
      logger.info('Factory event received:', message.payload);
      // Broadcast to WebSocket clients
      app.getSocketIO().emit('factory:event', message.payload);
    });

    mqttService.onMessage(config.mqtt.topics.frigateEvents, message => {
      logger.info('Frigate event received:', message.payload);
      // Broadcast to WebSocket clients
      app.getSocketIO().emit('frigate:event', message.payload);

      // Optionally write to InfluxDB
      // This can be done here or left to Node-RED
    });

    // Start server
    app.listen();

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);

      try {
        // Close MQTT connection
        await mqttService.disconnect();

        // Close InfluxDB connection
        await influxDBService.close();

        // Close server
        app.server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });

        // Force close after 10 seconds
        setTimeout(() => {
          logger.error('Forcing shutdown after timeout');
          process.exit(1);
        }, 10000);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
