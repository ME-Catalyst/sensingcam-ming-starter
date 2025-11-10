# Logs and Diagnostics

## Containers
- `docker compose -f src/docker-compose.yml logs frigate` – Inspect video pipeline issues.
- `docker compose -f src/docker-compose.yml logs nodered` – Check flow execution and REST responses.
- `docker compose -f src/docker-compose.yml logs mosquitto` – Validate MQTT connections.

## Camera
- Use `scripts/test_camera_api.sh` with `--verbose` (set `TRACE_HTTP=1`) to print request/response details.
- Capture firmware logs from the sensingCam web UI when diagnosing RTSP disconnects.

## Metrics
- Query InfluxDB via `docker exec influxdb influx query 'from(bucket:"machine_events") |> range(start:-1h)'`.
- Export Grafana dashboards (`/api/dashboards/uid/<id>`) before making major edits.
