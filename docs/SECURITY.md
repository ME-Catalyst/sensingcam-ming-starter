# Security Baseline

1. **Change default credentials** – Update sensingCam (`main`/`servicelevel`), Mosquitto, Grafana, and InfluxDB credentials before exposing the stack.
2. **Use digest authentication** – The sensingCam REST API requires HTTP digest auth; scripts and automations should never fall back to basic auth.
3. **Transport security** – Terminate TLS at a reverse proxy for Grafana and Node-RED. Enable MQTT TLS with per-topic ACLs to limit producers vs consumers.
4. **Network isolation** – Place cameras on an isolated VLAN; only Frigate and Node-RED should reach RTSP/HTTPS endpoints.
5. **Firmware integrity** – Validate SHA-256 checksums for camera firmware and keep the device on the latest signed release.
6. **Audit trails** – Configure InfluxDB and Grafana to emit audit logs (Docker volumes provided). Ship logs to a SIEM if available.
7. **Secret management** – Store long-lived tokens in Docker secrets or an external vault. Avoid committing real credentials to version control; use `.env.example` as the template.
8. **Least privilege** – Generate separate InfluxDB tokens for writes (Node-RED) and reads (Grafana). Mosquitto ACLs should prevent the camera from subscribing to command topics.
