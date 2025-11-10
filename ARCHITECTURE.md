# Architecture Overview

This snapshot provides an entry point into the sensingCam MING Starter architecture. Detailed diagrams, component inventories, and data models remain authoritative in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Layered Stack

The stack aligns to four layers:

1. **Field Layer** – sensingCam SEC110 and PLCs generate deterministic signals.
2. **Edge Compute Layer** – Mosquitto, Node-RED, and Frigate react to events and capture video context.
3. **Data Layer** – InfluxDB persists enriched machine and clip metadata.
4. **Experience Layer** – Grafana and operators consume dashboards and insights.

See [`docs/ARCHITECTURE.md#layered-view`](docs/ARCHITECTURE.md#layered-view) for the mermaid diagram illustrating relationships and data flow across layers.

---

## Core Components

| Component | Role | Deep Dive |
|-----------|------|-----------|
| sensingCam SEC110 | Dual-RTSP camera with REST control for event-triggered recording. | [`docs/CAMERA_GUIDE.md`](docs/CAMERA_GUIDE.md) |
| Mosquitto | MQTT broker handling PLC alarms and Frigate metadata. | [`docs/ARCHITECTURE.md#component-responsibilities`](docs/ARCHITECTURE.md#component-responsibilities) |
| Node-RED | Automation logic bridging MQTT events, camera control, and InfluxDB writes. | [`docs/OPERATIONS.md#automation-flows`](docs/OPERATIONS.md#automation-flows) |
| Frigate | NVR capturing RTSP streams and publishing clip events. | [`docs/ARCHITECTURE.md#component-responsibilities`](docs/ARCHITECTURE.md#component-responsibilities) |
| InfluxDB | Time-series store for `machine_events` measurement. | [`docs/ARCHITECTURE.md#data-model`](docs/ARCHITECTURE.md#data-model) |
| Grafana | Visualization layer for dashboards and restreams. | [`docs/OPERATIONS.md#operational-dashboards`](docs/OPERATIONS.md#operational-dashboards) |

---

## Event Timeline

A standard anomaly-to-clip workflow follows this sequence:

1. PLC publishes an event on `machine/alert`.
2. Node-RED issues `POST /api/v1/event/recording/start` to the sensingCam.
3. Frigate ingests the RTSP stream, writes the clip, and emits metadata on `frigate/events`.
4. Node-RED correlates metadata and writes to InfluxDB (`machine_events`).
5. Grafana queries InfluxDB to surface the event timeline and video link.

Detailed timing considerations and sequence diagrams are captured in [`docs/ARCHITECTURE.md#event-sequence`](docs/ARCHITECTURE.md#event-sequence).

---

## Deployment Considerations

- **Networking:** VLAN isolation keeps camera traffic segregated—see [`docs/NETWORKING.md`](docs/NETWORKING.md).
- **Security:** Apply the checklist in [`docs/SECURITY.md`](docs/SECURITY.md) before exposing the stack beyond the OT network.
- **Storage:** Size Docker volumes for Frigate media, InfluxDB buckets, and Grafana state per [`docs/ARCHITECTURE.md#volume--storage-layout`](docs/ARCHITECTURE.md#volume--storage-layout).

For operational procedures, continue with the [User Manual](USER_MANUAL.md) and [Troubleshooting Guide](TROUBLESHOOTING.md).
