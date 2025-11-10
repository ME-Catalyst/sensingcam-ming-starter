# Configuration Matrix

## Environment Variables
| Variable | Service | Description |
|----------|---------|-------------|
| `MOSQUITTO_USERNAME` / `MOSQUITTO_PASSWORD` | Mosquitto | Credentials for authenticated MQTT clients. |
| `NODERED_USERNAME` / `NODERED_PASSWORD` | Node-RED | Admin UI access. |
| `INFLUXDB_BUCKET` | InfluxDB | Target bucket for `machine_events`. |
| `GRAFANA_ADMIN_PASSWORD` | Grafana | Bootstrap password for the admin user. |

## Camera Settings
- Update `src/frigate/config.yml` with the camera hostname, RTSP credentials, and motion detection parameters.
- Adjust `record.events.max_seconds` to balance storage consumption with review needs.
- When enabling HTTPS on the sensingCam, update Node-RED flow HTTP nodes accordingly.

## Node-RED Flows
- Environment variables are defined in `src/nodered/settings.js`. Align them with MQTT topics and InfluxDB buckets.
- Each flow node includes inline documentation. Export updates to `src/nodered/flows.json` and commit the diff.

## Grafana Dashboards
- Place dashboard JSON files in `src/grafana/provisioning/dashboards/`.
- Datasources are managed under `src/grafana/provisioning/datasources/` – ensure URLs point to the Compose service names.

Refer to [`docs/developer/internal_apis.md`](../developer/internal_apis.md) for payload structures when extending flows or dashboards.
