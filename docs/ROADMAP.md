# Roadmap

## Phase 1 – Proof of Concept
- Validate sensingCam connectivity and REST control flow using `scripts/test_camera_api.sh`.
- Stand up the Docker Compose stack locally; ingest sample PLC events to Frigate.
- Instrument Node-RED flows to correlate Frigate clip paths with MQTT event metadata.

## Phase 2 – Hardened Pilot
- Enable TLS for Mosquitto and Grafana; integrate with enterprise identity provider.
- Deploy InfluxDB retention policies and downsampling tasks to manage clip metadata growth.
- Build Grafana dashboards that juxtapose live HLS playback with anomaly KPIs.

## Phase 3 – Production Roll-out
- Deploy redundant brokers and databases (InfluxDB high availability / clustering strategy).
- Integrate predictive maintenance analytics leveraging Frigate object detection metrics.
- Automate firmware audits and backups for sensingCam devices via CI/CD pipelines.

## Stretch Goals
- Evaluate Shinobi as an alternative NVR when ONVIF discovery is required.
- Add GPU acceleration (e.g., NVIDIA or Intel Quick Sync) for multi-stream transcoding.
- Expand Node-RED flows to publish events into ERP/MES systems.
