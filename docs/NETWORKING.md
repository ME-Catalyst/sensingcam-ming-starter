# Networking Topology

The integration divides traffic into dedicated VLANs to keep camera streams isolated from corporate networks.

## Segments

- **VLAN_CAM** – sensingCam SEC110 devices. RTSP and HTTPS exposure limited to trusted hosts (e.g., NVR, Node-RED).
- **VLAN_IOT** – PLCs and auxiliary sensors publishing MQTT telemetry.
- **VLAN_APP** – Docker host running Mosquitto, Node-RED, InfluxDB, Grafana, and Frigate.
- **WAN_CORP** – Grafana viewers and operators connecting via HTTPS reverse proxy.

## Routing Guidelines

- Only Frigate should consume high-bandwidth RTSP streams from the camera VLAN. Node-RED interacts via HTTPS for control triggers.
- Use Mosquitto ACLs to restrict clients; the sensingCam (or shim services) should publish-only.
- Grafana is exposed via TLS termination at a reverse proxy; disable direct camera access from WAN clients.
- Employ QoS policies on the bridge network to prioritize MQTT and REST control traffic over video to avoid buffering.

## Ports Summary

| Service   | Port | Notes |
|-----------|------|-------|
| Mosquitto | 1883 | TLS recommended for PLC + Frigate events |
| Node-RED  | 1880 | Use adminAuth or reverse proxy auth |
| InfluxDB  | 8086 | Scoped tokens for writes vs. reads |
| Grafana   | 3000 | Serve behind HTTPS proxy |
| Frigate   | 8554 | RTSP restream |
| Frigate   | 8971 | Web UI + REST API |
| sensingCam| 443  | REST API (digest auth) |

Apply firewall rules preventing lateral movement between VLANs except for the documented service flows.
