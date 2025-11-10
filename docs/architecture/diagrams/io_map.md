# Network IO Map

| Zone | Endpoint | Protocol/Port | Purpose |
|------|----------|---------------|---------|
| OT Network | sensingCam SEC110 | RTSP 554/tcp, HTTP 80/tcp | Video streams and REST control. |
| Edge DMZ | Mosquitto | MQTT 1883/tcp | Alarm ingress and Frigate metadata. |
| Edge DMZ | Node-RED | HTTP 1880/tcp | Flow editor and webhook receiver. |
| Edge DMZ | Frigate | RTMP 1935/tcp, HTTP 8971/tcp | Clip processing and API access. |
| Edge DMZ | InfluxDB | HTTPS 8086/tcp | Telemetry ingest and queries. |
| Edge DMZ | Grafana | HTTPS 3000/tcp | Visualization and dashboards. |

Document VLAN IDs and firewall rules here when deploying to production. Update whenever new services are added to the compose stack.
