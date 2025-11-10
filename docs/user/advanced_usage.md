# Advanced Usage

## Hardened Pilot Checklist
- Enforce TLS for Grafana and InfluxDB by supplying certificates via Docker secrets.
- Rotate camera, MQTT, and Grafana credentials before onboarding plant-floor operators.
- Enable InfluxDB retention policies to suit compliance requirements.

## Automation Extensions
- Add Node-RED HTTP endpoints to notify CMMS or ticketing systems when critical alarms trigger.
- Mirror Frigate clips to an off-host NAS by enabling the built-in restreamer and using `rclone` scripts.

## Observability Enhancements
- Enable Frigate debug logging to tune detection thresholds.
- Capture stack metrics using the Prometheus exporters documented in [`docs/developer/examples/demo_scripts/`](../developer/examples/demo_scripts/).

Document production-specific adjustments here after each deployment to keep institutional knowledge current.
