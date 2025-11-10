# Troubleshooting Guide

Quick answers for the most common recovery scenarios. Extended procedures are organized under [`docs/troubleshooting/`](docs/troubleshooting/).

## Fast Checks
1. Run `scripts/verify_stack.sh` to confirm core services are reachable.
2. Inspect `docker compose -f src/docker-compose.yml ps` for restart loops.
3. Execute `scripts/test_camera_api.sh` with `SICK_CAMERA_HOST` set to validate camera credentials.

## Common Issues
| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| Node-RED shows `connection refused` on MQTT nodes. | Broker credentials changed or broker offline. | Update credentials in Node-RED environment variables and rerun the verify script. |
| Grafana panels are empty. | Frigate events not ingested or Flux query misconfigured. | Validate InfluxDB bucket via `docker exec influxdb influx query` and review [`docs/troubleshooting/logs_and_diagnostics.md`](docs/troubleshooting/logs_and_diagnostics.md). |
| Camera API returns 401. | Default credentials expired. | Rotate passwords per [`docs/troubleshooting/recovery.md`](docs/troubleshooting/recovery.md). |

## Escalation
When local steps fail, capture logs per [`docs/troubleshooting/logs_and_diagnostics.md`](docs/troubleshooting/logs_and_diagnostics.md) and update the incident notes referenced in [`CHANGELOG.md`](CHANGELOG.md) if the issue affects a release.
