# Developer Reference

This guide orients maintainers and contributors to the structure, configuration surfaces, and extension points of the sensingCam MING Starter. Deep design notes remain in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and implementation-specific guides under `docs/`.

---

## Repository Layout

| Path | Purpose | Key References |
|------|---------|----------------|
| `src/docker-compose.yml` | Defines the Mosquitto, Node-RED, Frigate, InfluxDB, and Grafana stack. | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| `src/frigate/config.yml` | Camera configuration, detector tuning, and recording profiles. | [`docs/CAMERA_GUIDE.md`](docs/CAMERA_GUIDE.md) |
| `src/nodered/flows.json` | Automation flows correlating MQTT events with camera control and InfluxDB writes. | [`docs/OPERATIONS.md#automation-flows`](docs/OPERATIONS.md#automation-flows) |
| `src/grafana/` | Provisioning scaffold for datasources and dashboards. | [`docs/OPERATIONS.md#operational-dashboards`](docs/OPERATIONS.md#operational-dashboards) |
| `examples/` | Templates and demonstration assets (e.g., `examples/frigate/config.yml`). | [`README.md`](README.md#fast-track-bring-up-checklist) |
| `tests/` | Smoke and integration validation harnesses. | [`README.md`](README.md#service-inventory) |
| `scripts/` | Validation and bootstrap utilities (`verify_stack.sh`, `test_camera_api.sh`). | [`docs/OPERATIONS.md#health-checks`](docs/OPERATIONS.md#health-checks) |
| `docs/` | Authoritative deep-dive documentation. | See cross-links in this reference. |

---

## Configuration Sources

- `src/.env` (copied from `src/.env.example`) provides container credentials and environment variables. Coordinate updates with the security guidance in [`docs/SECURITY.md#core-controls`](docs/SECURITY.md#core-controls).
- `src/frigate/config.yml` defines camera endpoints, motion zones, and retention—align with the stream advice in [`docs/CAMERA_GUIDE.md#stream-profiles`](docs/CAMERA_GUIDE.md#stream-profiles). Use `examples/frigate/config.yml` as a starter template.
- `src/nodered/settings.js` (generated inside the container when bind mounting) controls admin auth and credential secrets. Follow the hardening checklist in [`docs/SECURITY.md#hardening-checklist`](docs/SECURITY.md#hardening-checklist).
- Grafana provisioning YAML/JSON under `src/grafana/` should be version-controlled and referenced in pull requests.

Document configuration changes in the [Changelog](CHANGELOG.md) and tie them to roadmap items in [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Development Workflow

1. Create a feature branch and update relevant configuration or documentation.
2. Run `make checks` (yamllint + ShellCheck + compose health validation) before opening a pull request.
   Use `SKIP_COMPOSE_TEST=1 make checks` on systems without Docker to still lint YAML/Bash.
   Keep `scripts/verify_stack.sh` in sync when adding bespoke manual verification.
3. Export updated Node-RED flows and Grafana dashboards, committing them with descriptive messages.
4. Update this reference and the [User Manual](USER_MANUAL.md) when operator-facing behaviours change.

Use conventional commits or similarly structured messages so the [Changelog](CHANGELOG.md) can be generated consistently.

---

## Extending the Stack

- **Additional Cameras:** Duplicate camera blocks in `src/frigate/config.yml`, replicate Node-RED trigger flows, and update MQTT topics. Reference [`docs/ARCHITECTURE.md#extensibility-patterns`](docs/ARCHITECTURE.md#extensibility-patterns).
- **Advanced Analytics:** Publish Frigate object detection events to external inference services; ideas are catalogued under [`docs/ROADMAP.md#stretch-goals`](docs/ROADMAP.md#stretch-goals).
- **Edge-to-Cloud Sync:** Integrate InfluxDB replication or Telegraf agents per [`docs/ARCHITECTURE.md#extensibility-patterns`](docs/ARCHITECTURE.md#extensibility-patterns).
- **Security Hardening:** Introduce reverse proxies, TLS, and SSO following [`docs/SECURITY.md`](docs/SECURITY.md) and track progress in the [Roadmap](ROADMAP.md).

---

## Testing & Verification

- **Quality Gate:** `make checks` → `tests/run.sh` executes YAML/Bash linting and compose health validation. See `tests/README.md` for details.
- **Stack Verification:** `scripts/verify_stack.sh`
- **Camera API Smoke Test:** `scripts/test_camera_api.sh`
- **CI Integration:** Ensure the GitHub Actions workflow runs the same `make checks` gate and capture failures/remediation in [`docs/OPERATIONS.md#health-checks`](docs/OPERATIONS.md#health-checks).

When adding new scripts or services, update this section and append troubleshooting entries to the [Troubleshooting Guide](TROUBLESHOOTING.md).

---

## Related Documentation

- [Architecture Overview](ARCHITECTURE.md) – component map and deployment considerations.
- [User Manual](USER_MANUAL.md) – operator-centric workflows.
- [`docs/NETWORKING.md`](docs/NETWORKING.md) – VLAN/QoS strategies when modifying infrastructure.
- [`docs/SECURITY.md`](docs/SECURITY.md) – policy-aligned hardening steps.

Keep the Developer Reference synchronized with configuration artifacts and automation exports to maintain a reliable onboarding guide for contributors.
