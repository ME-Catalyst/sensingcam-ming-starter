# Data Flow and Integration Points

This reference describes how events traverse the sensingCam MING Starter.

## Sequence Overview
```mermaid
sequenceDiagram
    autonumber
    participant PLC as PLC / Sensor
    participant MQTT as Mosquitto
    participant NR as Node-RED
    participant CAM as sensingCam SEC110
    participant FR as Frigate
    participant DB as InfluxDB
    participant UI as Grafana

    PLC->>MQTT: Publish `machine/alert/<line>`
    MQTT-->>NR: Deliver anomaly payload
    NR->>CAM: POST /api/v1/event/recording/start
    CAM-->>FR: RTSP primary stream
    FR-->>MQTT: Publish clip metadata
    MQTT-->>NR: Forward clip event
    NR->>DB: Write `machine_events` measurement
    UI->>DB: Query Flux dashboard
    DB-->>UI: Render correlated timeline
```

## Topic and Bucket Map
| Source | Destination | Payload | Notes |
|--------|-------------|---------|-------|
| PLC | Mosquitto | `machine/alert/<asset>` | JSON containing `line`, `station`, and `severity`. |
| Node-RED | sensingCam | REST POST | Camera credentials pulled from environment variables. |
| Frigate | Mosquitto | `frigate/events` | Clip metadata with `id`, `label`, `event_type`. |
| Node-RED | InfluxDB | `machine_events` | Tags for `line`, `station`, `severity`; fields include clip URL. |

## Storage Layout
- Frigate media is persisted in the `./media` volume configured in `docker-compose.yml`.
- InfluxDB stores data in the `machine_events` bucket with a default 30-day retention (override via environment variables).
- Grafana dashboards are provisioned from `src/grafana/provisioning/`.

## Networking Notes
Review VLAN boundaries, firewall ports, and cross-zone dependencies in [`diagrams/io_map.md`](diagrams/io_map.md).
