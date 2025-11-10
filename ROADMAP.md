# Roadmap Overview

This document highlights the high-level delivery plan for the sensingCam MING Starter. The detailed backlog, checklists, and diagrams continue to live in [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Phase Snapshot

| Phase | Status | Summary |
|-------|--------|---------|
| Proof of Concept | ⚙️ In progress | Compose stack, Node-RED flows, Frigate config, and verification scripts are ready for lab validation. |
| Hardened Pilot | 🕒 Not started | Security, retention, and alerting improvements staged for post-proof hardening. |
| Production Roll-out | ⛔ Not started | Redundancy, backups, and cloud mirroring scheduled after the pilot closes. |
| Stretch Goals | Backlog | Optional enhancements such as GPU acceleration and ERP integrations. |

See [`docs/ROADMAP.md#current-progress-snapshot`](docs/ROADMAP.md#current-progress-snapshot) for the canonical table and acceptance notes.

---

## Phase Highlights

### Phase 1 – Proof of Concept

Focus on validating sensingCam connectivity and the anomaly-to-clip workflow end-to-end. Use:

- [`docs/ROADMAP.md#phase-1--proof-of-concept`](docs/ROADMAP.md#phase-1--proof-of-concept) for the authoritative checklist.
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) to capture lessons learned during lab testing.
- [`docs/CAMERA_GUIDE.md`](docs/CAMERA_GUIDE.md) to tune camera profiles before final sign-off.

### Phase 2 – Hardened Pilot

After Phase 1 exit criteria are met, enable security, observability, and retention controls. Cross-reference:

- [`docs/ROADMAP.md#phase-2--hardened-pilot`](docs/ROADMAP.md#phase-2--hardened-pilot) for detailed tasks.
- [`docs/SECURITY.md`](docs/SECURITY.md) for TLS, credential rotation, and incident response guidance.
- [`docs/NETWORKING.md`](docs/NETWORKING.md) for VLAN/firewall updates aligned to the pilot scope.

### Phase 3 – Production Roll-out

Promote the hardened pilot into steady-state production with redundancy and disaster recovery.

- [`docs/ROADMAP.md#phase-3--production-roll-out`](docs/ROADMAP.md#phase-3--production-roll-out) provides the full backlog.
- [`docs/OPERATIONS.md#runbooks`](docs/OPERATIONS.md#runbooks) and [`docs/SECURITY.md#incident-response-playbook`](docs/SECURITY.md#incident-response-playbook) keep runbooks and playbooks synchronized.

### Stretch Goals

Track experimental work and long-range investments such as predictive analytics and cloud synchronization under [`docs/ROADMAP.md#stretch-goals`](docs/ROADMAP.md#stretch-goals).

---

## Working the Roadmap

1. **Review status** during sprint/maintenance planning using this overview, then dive into the canonical sections under `docs/` for execution detail.
2. **Update both layers** when plans change: capture authoritative edits in [`docs/ROADMAP.md`](docs/ROADMAP.md) and refresh the summary tables here.
3. **Link related artifacts** such as Grafana dashboards or Node-RED flow updates in pull requests so the roadmap remains a reliable entry point.

For additional context on operational readiness, pair this roadmap with the [User Manual](USER_MANUAL.md) and [Developer Reference](DEVELOPER_REFERENCE.md).
