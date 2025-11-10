# Developer Reference

This reference guides contributors through the project layout, coding conventions, and extension points. Deep dives live under [`docs/developer/`](docs/developer/).

## Repository Layout
- `src/` – Docker Compose stack, service provisioning, and configuration templates.
- `scripts/` – Operational scripts for verification, API probing, and seeding data.
- `tests/` – Smoke tests, lint harnesses, and CI utilities.
- `examples/` – Sample Frigate configuration snippets and flow exports.
- `docs/` – Extended documentation, diagrams, and samples grouped by topic.

## Conventions
- Shell scripts use `set -euo pipefail` and include descriptive comments; see [`docs/developer/conventions.md`](docs/developer/conventions.md).
- YAML manifests are linted with `tests/lint.sh` to maintain consistent formatting.
- Compose services expose configuration through environment variables for automation.

## Extension Points
- API entry points and payload schemas are cataloged in [`docs/developer/internal_apis.md`](docs/developer/internal_apis.md).
- Example automations and sample configuration bundles are available under [`docs/developer/examples/`](docs/developer/examples/).
- When adding new services, update diagrams under `docs/architecture/diagrams/` and capture behaviour in [`CHANGELOG.md`](CHANGELOG.md).

Consult [`docs/developer/examples/README.md`](docs/developer/examples/README.md) for quick-start patterns when building integrations.
