# Troubleshooting Guide

Use this guide to diagnose common issues across the sensingCam MING Starter stack. Each scenario links to deeper runbooks within `docs/` for extended debugging steps.

---

## Quick Reference Matrix

| Symptom | Likely Area | First Checks | Deep Dive |
|---------|-------------|--------------|-----------|
| Camera recording never starts | sensingCam / Node-RED | Run `scripts/test_camera_api.sh`, inspect Node-RED HTTP nodes. | [`docs/OPERATIONS.md#camera-recording-not-starting`](docs/OPERATIONS.md#camera-recording-not-starting) |
| MQTT topics back up | Mosquitto / Clients | Monitor `$SYS/` topics, restart stuck containers. | [`docs/OPERATIONS.md#mqtt-queue-buildup`](docs/OPERATIONS.md#mqtt-queue-buildup) |
| Grafana stream panel blank | Frigate / Networking | Test `http://<host>:8971/api/live`, review proxy headers. | [`docs/OPERATIONS.md#grafana-stream-tile-blank`](docs/OPERATIONS.md#grafana-stream-tile-blank) |
| RTSP jitter or drops | Camera configuration | Lower bitrate, review QoS policy. | [`docs/CAMERA_GUIDE.md#diagnostics`](docs/CAMERA_GUIDE.md#diagnostics), [`docs/NETWORKING.md#quality-of-service`](docs/NETWORKING.md#quality-of-service) |
| REST 401 errors | Authentication | Verify digest auth credentials and clock sync. | [`docs/CAMERA_GUIDE.md#rest-api-tips`](docs/CAMERA_GUIDE.md#rest-api-tips) |
| Edge host low on disk | Storage planning | Inspect Docker volumes, archive media. | [`docs/ARCHITECTURE.md#volume--storage-layout`](docs/ARCHITECTURE.md#volume--storage-layout) |
| TLS/SSO misconfiguration | Security hardening | Review reverse proxy configuration. | [`docs/SECURITY.md#hardening-checklist`](docs/SECURITY.md#hardening-checklist) |

---

## General Workflow

1. **Identify the failing layer** (camera, automation, storage, visualization) using the [Architecture Overview](ARCHITECTURE.md).
2. **Collect logs and metrics:**
   - Node-RED editor debug pane and Docker container logs.
   - Mosquitto `$SYS/` metrics and Grafana alert history.
   - Frigate clip listings under `./media`.
3. **Consult targeted runbooks** in [`docs/OPERATIONS.md`](docs/OPERATIONS.md) and the specialized guides linked above.
4. **Document findings** in the [Changelog](CHANGELOG.md) or internal ticketing system to inform future triage.

---

## Escalation Criteria

Escalate to the contacts listed in [`docs/OPERATIONS.md#contacts--escalation`](docs/OPERATIONS.md#contacts--escalation) when:

- Multiple layers exhibit failures simultaneously (e.g., camera + MQTT).
- Security incidents or suspected credential compromises occur—follow [`docs/SECURITY.md#incident-response-playbook`](docs/SECURITY.md#incident-response-playbook).
- Retention or compliance requirements are at risk due to prolonged outages.

---

## Preventive Maintenance

- Schedule health checks using `scripts/verify_stack.sh` and integrate alerts per [`docs/OPERATIONS.md#health-checks`](docs/OPERATIONS.md#health-checks).
- Keep firmware and container images updated; reference [`docs/SECURITY.md#patch--vulnerability-management`](docs/SECURITY.md#patch--vulnerability-management).
- Validate VLAN and QoS policies quarterly against [`docs/NETWORKING.md`](docs/NETWORKING.md) to catch drift.

For operator workflows and daily routines, reference the [User Manual](USER_MANUAL.md). For deeper architectural context, see [Architecture Overview](ARCHITECTURE.md).
