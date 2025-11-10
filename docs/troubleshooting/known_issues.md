# Known Issues

| Issue | Status | Workaround |
|-------|--------|------------|
| Camera firmware < 2.6 intermittently drops RTSP connections. | Monitor | Upgrade firmware or enable TCP streaming mode. |
| Node-RED flow import fails on first run. | Fixed in 0.2.0 | Redeploy using the committed `flows.json`. |
| Grafana panels display `HTTP 401`. | Monitor | Ensure InfluxDB tokens match `src/.env` values. |

Update this list whenever regressions are discovered and link to relevant CHANGELOG entries.
