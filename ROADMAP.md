# Roadmap

The sensingCam MING Starter follows an incremental rollout. Each phase is tracked here and in detail under [`docs/roadmap/`](docs/roadmap/) when deeper notes are required.

## Milestones
| Phase | Status | Summary |
|-------|--------|---------|
| Phase 1 – Proof of Concept | ✅ Complete | Compose stack validated locally with simulated PLC events and sample clips. |
| Phase 2 – Hardened Pilot | 🚧 In Progress | Add authentication hardening, retention policies, and automated health checks. |
| Phase 3 – Production Roll-out | ⏳ Planned | Implement redundancy, backups, and optional cloud synchronization. |

## Near-Term Focus
- Harden MQTT and REST credentials per the security checklist.
- Finalize Node-RED alerting hooks for maintenance notifications.
- Baseline Grafana dashboards with production data samples.

## Planning Notes
- Release coordination details and acceptance criteria for each milestone live in [`docs/roadmap/milestones.md`](docs/roadmap/milestones.md).
- Track cross-team dependencies and integration risks in [`docs/roadmap/risks.md`](docs/roadmap/risks.md).
- Update this overview whenever milestone status changes so downstream contributors have an authoritative snapshot.

Historical changes are captured in the [CHANGELOG](CHANGELOG.md).
