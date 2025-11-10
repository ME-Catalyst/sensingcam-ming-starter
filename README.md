# sensingCam MING Starter

A reproducible reference stack that couples a SICK sensingCam SEC110 with the MING (MQTT, InfluxDB, Node-RED, Grafana) edge toolkit. The repository ships with opinionated defaults so industrial teams can validate camera-to-dashboard workflows without building the plumbing from scratch.

## Quickstart
1. **Clone and configure** – Copy `src/.env.example` to `src/.env`, populate camera and service credentials, and review `src/frigate/config.yml` for stream details.
2. **Generate MQTT credentials** – Run `scripts/generate_mosquitto_passwords.sh` to create the password file consumed by the Mosquitto container.
3. **Launch services** – Start the stack with `docker compose -f src/docker-compose.yml up -d` and confirm container health using `scripts/verify_stack.sh`.
4. **Trigger a flow** – Execute `scripts/test_camera_api.sh` (after exporting `SICK_CAMERA_HOST`) or publish a PLC anomaly to see Frigate clips and Grafana timelines populate.

## Stack at a Glance
| Service | Role | Default Ports |
|---------|------|----------------|
| Mosquitto | MQTT broker for PLC alarms and Frigate events. | 1883/tcp |
| Node-RED | Automation flows that call camera REST endpoints and persist metadata. | 1880/tcp |
| InfluxDB | Time-series store for correlated machine and clip events. | 8086/tcp |
| Grafana | Dashboards for event timelines and playback. | 3000/tcp |
| Frigate | NVR that ingests the sensingCam stream and emits clip metadata. | 8554/tcp, 8971/tcp |

## Documentation Map
The repository keeps the entry-point documents at the root and extended references under `docs/`:

- [ARCHITECTURE.md](ARCHITECTURE.md) – Layered system overview and data paths.
- [USER_MANUAL.md](USER_MANUAL.md) – Installation, configuration, and validation steps.
- [DEVELOPER_REFERENCE.md](DEVELOPER_REFERENCE.md) – Code organization, APIs, and contribution tips.
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) – Common recovery procedures.
- [ROADMAP.md](ROADMAP.md) – Milestones and release planning.
- [CHANGELOG.md](CHANGELOG.md) – Version history.
- Explore `/docs` for diagrams, extended guides, and reusable examples.

## Visual Reference
High-level diagrams and implementation visuals live under `docs/visuals/`. Exported mermaid sources are available for customization alongside PNG/SVG renders.

## License
Released under the [MIT License](LICENSE.md). **No Warranty or Liability – Provided “as-is,” without warranty of any kind.**
