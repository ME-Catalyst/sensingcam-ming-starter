# Networking Topology

The integration divides traffic into dedicated VLANs to keep camera streams isolated from corporate networks. This guide documents VLAN assignments, firewall rules, and quality-of-service (QoS) hints so controls engineers and IT can collaborate confidently.

---

## Logical Segmentation

```mermaid
flowchart LR
    subgraph VLAN_CAM [VLAN_CAM – Camera]
        CAM[sensingCam SEC110]
    end
    subgraph VLAN_IOT [VLAN_IOT – PLC & Sensors]
        PLC[PLC / Sensor]
    end
    subgraph VLAN_APP [VLAN_APP – Edge Host]
        Mosq[(Mosquitto)]
        NR[Node-RED]
        Fr[Frigate]
        Influx[(InfluxDB)]
        Graf[Grafana]
    end
    subgraph WAN [WAN_CORP – Corporate]
        Users[Grafana Viewers]
    end

    PLC -->|MQTT TLS| Mosq
    CAM -->|RTSP (TCP/UDP)| Fr
    CAM -->|HTTPS (REST)| NR
    Fr -->|MQTT Events| Mosq
    NR -->|Flux Writes| Influx
    Users -->|HTTPS Reverse Proxy| Graf
```

- **VLAN_CAM** – sensingCam SEC110 devices. RTSP and HTTPS exposure limited to trusted hosts (Frigate, Node-RED).
- **VLAN_IOT** – PLCs and auxiliary sensors publishing MQTT telemetry.
- **VLAN_APP** – Docker host running Mosquitto, Node-RED, InfluxDB, Grafana, and Frigate.
- **WAN_CORP** – Grafana viewers and operators connecting via HTTPS reverse proxy.

---

## Firewall Policy Matrix

| Source → Destination | Allow? | Ports | Notes |
|---------------------|--------|-------|-------|
| PLC (VLAN_IOT) → Mosquitto (VLAN_APP) | ✅ | 8883 (MQTTS) / 1883 (MQTT for lab) | Enforce client certs or username/password. |
| Node-RED (VLAN_APP) → sensingCam (VLAN_CAM) | ✅ | 443/TCP | Digest-auth REST control. |
| Frigate (VLAN_APP) → sensingCam (VLAN_CAM) | ✅ | 554/TCP/UDP, 8554/TCP | RTSP primary and restream. Lock to camera IP. |
| sensingCam → Frigate | ✅ | 554/TCP/UDP | Some firmware pushes server-side RTSP. Ensure stateful firewall permits return traffic. |
| Frigate → Mosquitto | ✅ | 1883/8883 | Clip event publication. |
| Node-RED → InfluxDB | ✅ | 8086/TCP | Write token only. |
| Grafana → InfluxDB | ✅ | 8086/TCP | Read-only token. |
| Corporate Users → Grafana | ✅ | 443/TCP | Via reverse proxy / SSO gateway. |
| Corporate Users → sensingCam | ❌ | — | Block to prevent direct camera access. |
| Internet → Docker Host | ⚠️ | Minimal | Restrict to necessary ports; prefer VPN. |

---

## QoS & Bandwidth Planning

- **RTSP Streams**: Size VLAN_CAM to accommodate primary (5 MP) and secondary streams simultaneously. Reserve ~20 Mbps per camera depending on codec/bitrate.
- **MQTT Traffic**: Prioritize anomaly topics over telemetry by assigning higher QoS or DSCP markings (e.g., CS4) to `machine/alerts/#`.
- **REST Control**: Ensure HTTPS control packets are expedited to avoid delayed capture triggers.
- **Grafana Traffic**: Cache Grafana assets via CDN or proxy to reduce repeated WAN bandwidth.

---

## DHCP & Addressing Tips

| Device | Strategy | Example |
|--------|----------|---------|
| sensingCam | Static or DHCP reservation | `10.10.20.30/24` on VLAN_CAM |
| Edge Host | Static with gateway to corporate DMZ | `10.10.40.10/24` on VLAN_APP |
| PLC / Sensors | DHCP reservation with limited DNS access | `10.10.10.x/24` |
| Reverse Proxy | Dual-homed (VLAN_APP + WAN_CORP) | `10.10.40.20/24` + `172.16.0.20/24` |

Use DNS entries (`sec110-line1.local`) to avoid hard-coded IPs in Node-RED flows or Frigate config. When possible, isolate management interfaces on a jump VLAN accessible via VPN.

---

## Monitoring & Alerting

- **NetFlow / sFlow** on inter-VLAN routers to detect unexpected bandwidth spikes.
- **SNMP polling** on the sensingCam to track uptime, temperature, and firmware revision.
- **Prometheus or Telegraf** scraping Docker host metrics (CPU, disk IO) to ensure Frigate has headroom.
- **Firewall logs** integrated into SIEM to spot unauthorized access attempts.

---

## Troubleshooting Checklist

1. **No video in Frigate** → Confirm RTSP URL, verify firewall stateful rules, check camera VLAN reachability.
2. **Node-RED cannot trigger camera** → Validate digest auth credentials, ensure `NR → sensingCam` HTTPS allowed.
3. **Grafana panels empty** → Test InfluxDB token, inspect MQTT-to-Influx pipeline via Node-RED debug nodes.
4. **MQTT disconnects** → Increase keepalive interval, ensure QoS 1 topics have durable session, review broker logs.
5. **WAN access slow** → Confirm reverse proxy caching, evaluate WAN bandwidth, tune Grafana panel refresh interval.

Document findings in [`docs/OPERATIONS.md`](OPERATIONS.md) after each incident to build tribal knowledge.
