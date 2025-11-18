# SensingCam Backend API

Backend API service for the SensingCam MING application, providing REST endpoints and WebSocket connections for camera management, event tracking, and real-time notifications.

## Features

- **REST API**: Complete API for events, clips, camera control
- **WebSocket**: Real-time event streaming via Socket.IO
- **InfluxDB Integration**: Time-series event data storage and querying
- **MQTT Bridge**: Subscribe to factory and Frigate events
- **Frigate Integration**: Video clip and detection management
- **Camera Control**: Trigger recordings on sensingCam device
- **Authentication**: JWT-based auth with role-based access control
- **TypeScript**: Fully typed codebase
- **Docker**: Containerized deployment

## Prerequisites

- Node.js 20+
- Docker (for containerized deployment)
- Access to MQTT broker, InfluxDB, and Frigate services

## Installation

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run in development mode
npm run dev
```

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build image
docker build -t sensingcam-backend .

# Run container
docker run -d \
  --name sensingcam-backend \
  -p 4000:4000 \
  --env-file .env \
  sensingcam-backend
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get events with filtering
- `GET /api/events/:id` - Get specific event
- `GET /api/events/statistics` - Get event statistics

### Frigate
- `GET /api/frigate/status` - Frigate service status
- `GET /api/frigate/cameras` - List cameras
- `GET /api/frigate/clips` - Get video clips
- `GET /api/frigate/clips/:id` - Get specific clip
- `GET /api/frigate/clips/:id/download` - Download clip

### Camera
- `GET /api/camera/status` - Camera connection status
- `GET /api/camera/stream` - Get RTSP stream URL
- `POST /api/camera/record/start` - Start recording (admin/operator only)
- `POST /api/camera/record/stop` - Stop recording (admin/operator only)

### Health
- `GET /api/health` - Service health check

## WebSocket Events

### Client → Server
- `connection` - Client connects

### Server → Client
- `factory:event` - Factory line event received
- `frigate:event` - Frigate detection event received

## Environment Variables

See `.env.example` for all configuration options.

### Critical Variables
- `INFLUXDB_TOKEN` - InfluxDB authentication token
- `JWT_SECRET` - Secret for JWT signing (must be changed in production)
- `MQTT_PASSWORD` - MQTT broker password

## Development

```bash
# Run with auto-reload
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Build TypeScript
npm run build
```

## Default Credentials

On first run, a default admin user is created:

- **Username**: admin
- **Password**: admin123

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY!**

## Architecture

```
src/
├── controllers/    # Request handlers
├── routes/         # Route definitions
├── services/       # Business logic (InfluxDB, MQTT, Frigate, Camera)
├── middleware/     # Express middleware (auth, error handling, validation)
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
├── config/         # Configuration management
├── app.ts          # Express app setup
└── index.ts        # Application entry point
```

## Security

- JWT authentication for API access
- Role-based access control (admin, operator, viewer)
- Rate limiting on all endpoints
- Helmet.js for HTTP headers security
- CORS configured for frontend origin
- Input validation with Joi

## License

MIT
