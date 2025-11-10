# Architecture Overview

This document summarizes the layered structure of the sensingCam MING Starter. Detailed diagrams, data models, and engineering notes reside under [`docs/architecture/`](docs/architecture/).

## Layered Stack
1. **Field Layer** – sensingCam SEC110 and PLCs originate events and dual RTSP streams.
2. **Edge Compute Layer** – Mosquitto, Node-RED, and Frigate convert events into context-rich clips.
3. **Data Layer** – InfluxDB preserves anomaly metadata with retention aligned to plant requirements.
4. **Experience Layer** – Grafana provides dashboards and review workflows.

Refer to [`docs/architecture/data_flow.md`](docs/architecture/data_flow.md) for sequence diagrams and topic mappings.

## Component Responsibilities
| Component | Responsibility | Reference |
|-----------|----------------|-----------|
| sensingCam SEC110 | Supplies RTSP streams and REST event hooks. | [`docs/user/configuration.md`](docs/user/configuration.md) |
| Mosquitto | Routes PLC alarms and Frigate metadata. | [`docs/architecture/data_flow.md`](docs/architecture/data_flow.md) |
| Node-RED | Orchestrates REST calls and InfluxDB writes. | [`docs/developer/internal_apis.md`](docs/developer/internal_apis.md) |
| Frigate | Captures video clips and exposes detection metadata. | [`docs/architecture/diagrams/system_overview.md`](docs/architecture/diagrams/system_overview.md) |
| InfluxDB | Stores `machine_events` time-series. | [`docs/developer/conventions.md`](docs/developer/conventions.md) |
| Grafana | Visualizes correlated signals. | [`docs/user/advanced_usage.md`](docs/user/advanced_usage.md) |

## Deployment Considerations
- **Networking:** VLAN boundaries and firewall rules are documented in [`docs/architecture/diagrams/io_map.md`](docs/architecture/diagrams/io_map.md).
- **Security:** Harden camera credentials, MQTT auth, and TLS per [`docs/troubleshooting/recovery.md`](docs/troubleshooting/recovery.md).
- **Storage:** Volume sizing guidance lives alongside diagrams in [`docs/architecture/data_flow.md`](docs/architecture/data_flow.md).

For installation, see the [User Manual](USER_MANUAL.md). Development specifics are tracked in the [Developer Reference](DEVELOPER_REFERENCE.md).
