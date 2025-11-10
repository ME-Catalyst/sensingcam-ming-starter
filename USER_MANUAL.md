# User Manual

Follow this guide to bring the sensingCam MING Starter online and adapt it to your facility. Expanded walkthroughs, screenshots, and configuration matrices reside in [`docs/user/`](docs/user/).

## 1. Prerequisites
- Docker Engine 24+ with Compose Plugin.
- Access to a SICK sensingCam SEC110 (or emulator) reachable from the host.
- `mosquitto-clients`, `curl`, and `jq` installed for verification scripts.

## 2. Installation
1. Clone the repository and review the [Quickstart](README.md#quickstart).
2. Copy `src/.env.example` to `src/.env` and provide camera credentials, MQTT passwords, and Grafana seeds.
3. Adjust `src/frigate/config.yml` with RTSP URLs and retention preferences.
4. Launch the stack using `docker compose -f src/docker-compose.yml up -d`.
5. Validate service health with `scripts/verify_stack.sh` and `scripts/test_camera_api.sh`.

Detailed installation notes, including offline deployments and proxy-aware instructions, are stored in [`docs/user/install_guide.md`](docs/user/install_guide.md).

## 3. Configuration
- Customize Node-RED flows under `src/nodered/flows.json` to match topic names.
- Update Grafana provisioning files in `src/grafana/` to import dashboards automatically.
- Review retention and bucket policies for InfluxDB per [`docs/user/configuration.md`](docs/user/configuration.md).

## 4. Validation
Confirm the end-to-end workflow:
1. Publish a PLC anomaly (`machine/alert/test`) via `mosquitto_pub`.
2. Observe Node-RED logs for REST triggers.
3. Verify Frigate clip creation and metadata emission.
4. Refresh Grafana to confirm the event timeline populates.

Advanced walkthroughs, including pilot hardening tasks, live in [`docs/user/advanced_usage.md`](docs/user/advanced_usage.md).
