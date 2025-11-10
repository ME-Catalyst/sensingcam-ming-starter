# User Manual

This manual walks operators and integrators through deploying, operating, and maintaining the sensingCam MING Starter. For extended procedures, diagrams, and deep dives, follow the links into the `docs/` directory.

---

## Audience & Prerequisites

- **Audience:** Controls engineers, automation specialists, and operators responsible for day-to-day use of the stack.
- **Prerequisites:**
  - Docker Engine and Docker Compose installed on the edge host.
  - Access to a sensingCam SEC110 with firmware aligned to the guidance in [`docs/CAMERA_GUIDE.md`](docs/CAMERA_GUIDE.md).
  - Network connectivity that matches the VLAN and firewall layout in [`docs/NETWORKING.md`](docs/NETWORKING.md).
  - Rotated credentials stored securely, following the checklist in [`docs/SECURITY.md`](docs/SECURITY.md).

---

## First-Time Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/<org>/sensingcam-ming-starter.git
   cd sensingcam-ming-starter
   ```
2. **Populate configuration**
   - Copy `.env.example` → `.env` and fill in MQTT, camera, InfluxDB, and Grafana credentials.
   - Update `frigate/config.yml` with the sensingCam IP, stream profiles, and authentication tokens (see [`docs/CAMERA_GUIDE.md#stream-profiles`](docs/CAMERA_GUIDE.md#stream-profiles)).
   - Prepare persistent directories (`./media`, `./nodered/data`, `./grafana/data`) with appropriate permissions.
3. **Launch the stack**
   ```bash
   docker compose up -d
   scripts/verify_stack.sh
   ```
   The verification script exercises container health and MQTT flows. Extend it per [`docs/OPERATIONS.md#health-checks`](docs/OPERATIONS.md#health-checks).
4. **Load automations and dashboards**
   - Import `nodered/flows.json` through the Node-RED editor.
   - Provision Grafana datasources and dashboards using the scaffolding under [`grafana/provisioning/`](grafana/).
   - Capture configuration exports in version control per [`docs/OPERATIONS.md#change-management`](docs/OPERATIONS.md#change-management).

---

## Routine Operations

### Daily Checklist

Follow the tasks summarized below; detailed runbooks live in [`docs/OPERATIONS.md#daily-tasks`](docs/OPERATIONS.md#daily-tasks).

- Confirm Grafana dashboards render live streams and timelines.
- Validate Node-RED flows show no error badges and MQTT nodes remain connected.
- Inspect Frigate storage utilization and archive clips when nearing retention thresholds.
- Check MQTT broker metrics via `$SYS/` topics to ensure expected clients are connected.

### Weekly Checklist

- Export Node-RED flows and Grafana dashboards for backups.
- Run `scripts/verify_stack.sh` and review the output for regressions.
- Validate InfluxDB backups completed; investigate failures immediately.

---

## Working with Events

1. Trigger an anomaly from the PLC or use `scripts/test_camera_api.sh` for a synthetic run.
2. Monitor Node-RED debug logs to confirm REST calls return `200` responses.
3. Verify the clip appears in Frigate and that metadata is written to InfluxDB (`machine_events`).
4. Refresh Grafana dashboards to see the correlated timeline entry. Troubleshooting tips are consolidated in the [Troubleshooting Guide](TROUBLESHOOTING.md) and in [`docs/OPERATIONS.md#troubleshooting-recipes`](docs/OPERATIONS.md#troubleshooting-recipes).

---

## Security & Compliance Reminders

- Rotate credentials during each maintenance window; document changes in the [Changelog](CHANGELOG.md) and update vault entries.
- Enable TLS, admin authentication, and reverse proxies as described in [`docs/SECURITY.md#core-controls`](docs/SECURITY.md#core-controls).
- Capture incident response drills using the playbook in [`docs/SECURITY.md#incident-response-playbook`](docs/SECURITY.md#incident-response-playbook).

---

## When to Escalate

Use the contact roster in [`docs/OPERATIONS.md#contacts--escalation`](docs/OPERATIONS.md#contacts--escalation) if:

- MQTT queues persistently back up.
- Camera recordings fail repeatedly across shifts.
- Grafana dashboards or Frigate restreams remain unavailable after initial troubleshooting.

---

## Additional Resources

- [Architecture Overview](ARCHITECTURE.md) for context on system components and data flow.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) to understand upcoming changes that may affect operational procedures.
- [`docs/SECURITY.md`](docs/SECURITY.md) and [`docs/NETWORKING.md`](docs/NETWORKING.md) for policy-aligned configuration details.

Keep this manual updated alongside configuration changes to ensure shift teams rely on current instructions.
