import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiPrefix: process.env.API_PREFIX || '/api',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // InfluxDB
  influxdb: {
    url: process.env.INFLUXDB_URL || 'http://influxdb:8086',
    token: process.env.INFLUXDB_TOKEN || '',
    org: process.env.INFLUXDB_ORG || 'ming',
    bucket: process.env.INFLUXDB_BUCKET || 'machine_events',
  },

  // MQTT
  mqtt: {
    brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://mosquitto:1883',
    username: process.env.MQTT_USERNAME || 'ming',
    password: process.env.MQTT_PASSWORD || 'changeMe',
    clientId: process.env.MQTT_CLIENT_ID || 'sensingcam-backend',
    topics: {
      factoryEvents: 'factory/line/+/event',
      frigateEvents: 'frigate/events',
    },
  },

  // Frigate
  frigate: {
    url: process.env.FRIGATE_URL || 'http://frigate:8971',
    apiKey: process.env.FRIGATE_API_KEY || '',
  },

  // Camera
  camera: {
    host: process.env.CAMERA_HOST || '192.168.1.50',
    username: process.env.CAMERA_USERNAME || 'main',
    password: process.env.CAMERA_PASSWORD || 'servicelevel',
    protocol: process.env.CAMERA_PROTOCOL || 'http',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
} as const;

// Validate critical configuration
export function validateConfig() {
  const errors: string[] = [];

  if (!config.influxdb.token) {
    errors.push('INFLUXDB_TOKEN is required');
  }

  if (config.nodeEnv === 'production' && config.jwt.secret === 'your-secret-key-change-in-production') {
    errors.push('JWT_SECRET must be changed in production');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}
