# Tests

This directory houses smoke and integration validation assets. Initial automation will focus on:

- Verifying that the Docker Compose services defined in `src/docker-compose.yml` start and remain healthy.
- Exercising the MQTT, Node-RED, and Frigate HTTP APIs using lightweight shell scripts.
- Capturing regression checks for provisioning templates (Grafana dashboards, InfluxDB buckets).

Future updates should add scripts or test frameworks that can run in CI to validate the end-to-end sensingCam pipeline.
