# Developer Reference

This guide orients maintainers and contributors to the structure, configuration surfaces, and extension points of the sensingCam MING Starter. Deep design notes remain in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and implementation-specific guides under `docs/`.

---

## Repository Layout

| Path | Purpose | Key References |
|------|---------|----------------|
| `docker-compose.yml` | Defines the Mosquitto, Node-RED, Frigate, InfluxDB, and Grafana stack. | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| `frigate/` | Camera configuration, detector tuning, and recording profiles. | [`docs/CAMERA_GUIDE.md`](docs/CAMERA_GUIDE.md) |
| `nodered/flows.json` | Automation flows correlating MQTT events with camera control and InfluxDB writes. | [`docs/OPERATIONS.md#automation-flows`](docs/OPERATIONS.md#automation-flows) |
| `grafana/` | Provisioning scaffold for datasources and dashboards. | [`docs/OPERATIONS.md#operational-dashboards`](docs/OPERATIONS.md#operational-dashboards) |
| `scripts/` | Validation and bootstrap utilities (`verify_stack.sh`, `test_camera_api.sh`). | [`docs/OPERATIONS.md#health-checks`](docs/OPERATIONS.md#health-checks) |
| `docs/` | Authoritative deep-dive documentation. | See cross-links in this reference. |

---

## Configuration Sources

- `.env` (copied from `.env.example`) provides container credentials and environment variables. Coordinate updates with the security guidance in [`docs/SECURITY.md#core-controls`](docs/SECURITY.md#core-controls).
- `frigate/config.yml` defines camera endpoints, motion zones, and retention—align with the stream advice in [`docs/CAMERA_GUIDE.md#stream-profiles`](docs/CAMERA_GUIDE.md#stream-profiles).
- `nodered/settings.js` (generated inside the container) controls admin auth and credential secrets. Follow the hardening checklist in [`docs/SECURITY.md#hardening-checklist`](docs/SECURITY.md#hardening-checklist).
- Grafana provisioning YAML/JSON under `grafana/` should be version-controlled and referenced in pull requests.

Document configuration changes in the [Changelog](CHANGELOG.md) and tie them to roadmap items in [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Development Workflow

1. Create a feature branch and update relevant configuration or documentation.
2. Run `scripts/verify_stack.sh` locally or in CI to ensure the stack responds (extend for new services as needed).
3. Export updated Node-RED flows and Grafana dashboards, committing them with descriptive messages.
4. Update this reference and the [User Manual](USER_MANUAL.md) when operator-facing behaviours change.

Use conventional commits or similarly structured messages so the [Changelog](CHANGELOG.md) can be generated consistently.

---

## Extending the Stack

- **Additional Cameras:** Duplicate camera blocks in `frigate/config.yml`, replicate Node-RED trigger flows, and update MQTT topics. Reference [`docs/ARCHITECTURE.md#extensibility-patterns`](docs/ARCHITECTURE.md#extensibility-patterns).
- **Advanced Analytics:** Publish Frigate object detection events to external inference services; ideas are catalogued under [`docs/ROADMAP.md#stretch-goals`](docs/ROADMAP.md#stretch-goals).
- **Edge-to-Cloud Sync:** Integrate InfluxDB replication or Telegraf agents per [`docs/ARCHITECTURE.md#extensibility-patterns`](docs/ARCHITECTURE.md#extensibility-patterns).
- **Security Hardening:** Introduce reverse proxies, TLS, and SSO following [`docs/SECURITY.md`](docs/SECURITY.md) and track progress in the [Roadmap](ROADMAP.md).

---

## Testing & Verification

- **Stack Verification:** `scripts/verify_stack.sh`
- **Camera API Smoke Test:** `scripts/test_camera_api.sh`
- **CI Integration:** Wire both scripts into scheduled jobs; record failures and remediation steps in [`docs/OPERATIONS.md#health-checks`](docs/OPERATIONS.md#health-checks).

When adding new scripts or services, update this section and append troubleshooting entries to the [Troubleshooting Guide](TROUBLESHOOTING.md).

---

## Related Documentation

- [Architecture Overview](ARCHITECTURE.md) – component map and deployment considerations.
- [User Manual](USER_MANUAL.md) – operator-centric workflows.
- [`docs/NETWORKING.md`](docs/NETWORKING.md) – VLAN/QoS strategies when modifying infrastructure.
- [`docs/SECURITY.md`](docs/SECURITY.md) – policy-aligned hardening steps.

Keep the Developer Reference synchronized with configuration artifacts and automation exports to maintain a reliable onboarding guide for contributors.
