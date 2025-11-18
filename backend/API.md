# SensingCam Backend API Documentation

## Base URL

```
http://localhost:4000/api
```

## Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

---

## Authentication Endpoints

### POST /auth/login

Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@sensingcam.local",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### POST /auth/register

Register a new user.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "viewer"
}
```

**Roles:** `admin`, `operator`, `viewer`

### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### GET /auth/me

Get current authenticated user.

**Headers:** Requires authentication

---

## Events Endpoints

### GET /events

Get machine events from InfluxDB.

**Headers:** Requires authentication

**Query Parameters:**
- `start` - Start time (InfluxDB format, default: `-24h`)
- `end` - End time (InfluxDB format, default: `now()`)
- `line` - Filter by production line
- `camera` - Filter by camera
- `event` - Filter by event type
- `limit` - Number of results (default: 100)
- `offset` - Offset for pagination (default: 0)

**Example:**
```
GET /api/events?start=-7d&limit=50&line=assembly_1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": "2025-11-18T10:30:00Z",
      "line": "assembly_1",
      "camera": "sensingcam",
      "event": "stop",
      "video": "/media/frigate/clips/event_123.mp4",
      "thumbnail": "/api/frigate/events/123/thumbnail.jpg",
      "duration_seconds": 30
    }
  ],
  "count": 1
}
```

### GET /events/:id

Get specific event by ID (timestamp).

**Headers:** Requires authentication

### GET /events/statistics

Get aggregated event statistics.

**Headers:** Requires authentication

**Query Parameters:**
- `start` - Start time (default: `-24h`)
- `end` - End time (default: `now()`)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEvents": 42
  }
}
```

---

## Frigate Endpoints

### GET /frigate/status

Get Frigate service status and statistics.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "0.13.0",
    "stats": {
      "cameras": {...},
      "detectors": {...},
      "service": {
        "uptime": 86400,
        "version": "0.13.0"
      }
    },
    "available": true
  }
}
```

### GET /frigate/cameras

Get list of available cameras.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": ["sensingcam", "camera2"]
}
```

### GET /frigate/clips

Get video clips with filtering.

**Headers:** Requires authentication

**Query Parameters:**
- `camera` - Filter by camera name
- `label` - Filter by detection label
- `after` - Events after timestamp (Unix epoch)
- `before` - Events before timestamp (Unix epoch)
- `limit` - Number of results (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event_123",
      "camera": "sensingcam",
      "start_time": 1700000000,
      "end_time": 1700000030,
      "path": "/media/frigate/clips/event_123.mp4",
      "has_clip": true,
      "has_snapshot": true
    }
  ],
  "count": 1
}
```

### GET /frigate/clips/:id

Get specific clip details.

**Headers:** Requires authentication

### GET /frigate/clips/:id/url

Get URLs for clip, snapshot, and thumbnail.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "clipUrl": "http://frigate:8971/api/events/event_123/clip.mp4",
    "snapshotUrl": "http://frigate:8971/api/events/event_123/snapshot.jpg",
    "thumbnailUrl": "http://frigate:8971/api/events/event_123/thumbnail.jpg"
  }
}
```

### GET /frigate/clips/:id/download

Download clip file.

**Headers:** Requires authentication

**Response:** Binary video file (MP4)

---

## Camera Endpoints

### GET /camera/status

Get camera connection status.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "online": true,
    "host": "192.168.1.50",
    "stream_url": "rtsp://main:***@192.168.1.50/stream1",
    "last_check": "2025-11-18T10:30:00Z"
  }
}
```

### GET /camera/stream

Get RTSP stream URL.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "streamUrl": "rtsp://main:servicelevel@192.168.1.50/stream1"
  }
}
```

### GET /camera/device

Get camera device information.

**Headers:** Requires authentication

### POST /camera/record/start

Start manual recording on camera.

**Headers:** Requires authentication (admin or operator only)

**Request Body:**
```json
{
  "duration": 30,
  "pre_roll": 5,
  "post_roll": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Recording started successfully"
}
```

### POST /camera/record/stop

Stop active recording.

**Headers:** Requires authentication (admin or operator only)

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Recording stopped successfully"
}
```

---

## Health Check

### GET /health

Service health check (no authentication required).

**Response:**
```json
{
  "success": true,
  "message": "SensingCam API is running",
  "timestamp": "2025-11-18T10:30:00.000Z"
}
```

---

## WebSocket Events

Connect to Socket.IO at: `http://localhost:4000`

### Server → Client Events

**factory:event**
```json
{
  "line": "assembly_1",
  "station": "station_3",
  "severity": "high",
  "event": "stop"
}
```

**frigate:event**
```json
{
  "id": "event_123",
  "camera": "sensingcam",
  "label": "person",
  "type": "new",
  "after": {
    "start_time": 1700000000,
    "path": "/media/frigate/clips/event_123.mp4",
    "thumbnail": "/api/events/event_123/thumbnail.jpg"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Auth endpoints: 5 attempts per 15 minutes

---

## Examples

### Full Authentication Flow

```bash
# 1. Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Use token in requests
export TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl http://localhost:4000/api/events \
  -H "Authorization: Bearer $TOKEN"
```

### Query Events

```bash
# Get events from last 7 days
curl "http://localhost:4000/api/events?start=-7d&limit=50" \
  -H "Authorization: Bearer $TOKEN"

# Filter by line and event type
curl "http://localhost:4000/api/events?line=assembly_1&event=stop" \
  -H "Authorization: Bearer $TOKEN"
```

### Download Clip

```bash
curl "http://localhost:4000/api/frigate/clips/event_123/download" \
  -H "Authorization: Bearer $TOKEN" \
  -o clip.mp4
```

### Start Recording

```bash
curl -X POST http://localhost:4000/api/camera/record/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"duration":30,"pre_roll":5,"post_roll":5}'
```
