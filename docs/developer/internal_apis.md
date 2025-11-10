# Internal APIs and Events

## sensingCam REST
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/event/recording/start` | Starts an event recording with configured pre/post roll. |
| `POST` | `/api/v1/event/recording/stop` | Stops the active recording early if required. |
| `GET` | `/api/v1/device` | Returns device metadata and stream status. |

Include `--digest` authentication when calling these endpoints. Credentials are drawn from environment variables defined in the Node-RED flows and helper scripts.

## MQTT Topics
| Topic | Producer | Payload |
|-------|----------|---------|
| `machine/alert/<line>` | PLC / Simulator | JSON: `{ "line": "A", "station": "Press-1", "severity": "critical" }`. |
| `frigate/events` | Frigate | JSON events that include `id`, `camera`, `label`, `type`, and `after` clip URL. |

## InfluxDB Measurement
The `machine_events` measurement stores the following fields:
- `clip_url` – Signed URL or relative path to the recorded clip.
- `event_type` – `alert`, `heartbeat`, or `diagnostic`.
- `duration_seconds` – Clip duration.

Tags include `line`, `station`, and `severity` to simplify Flux queries.

## Node-RED Flow Contracts
- HTTP request nodes expect environment variables `SICK_CAMERA_HOST`, `SICK_CAMERA_USERNAME`, and `SICK_CAMERA_PASSWORD`.
- MQTT nodes assume TLS can be enabled by toggling the `MQTT_USE_TLS` environment variable.
- When adding new flows, document payload structures in this file and update `src/nodered/flows.json` comments accordingly.
