# Contributor Conventions

## Shell Scripts
- Start with `#!/usr/bin/env bash` and `set -euo pipefail`.
- Document required environment variables at the top of each script.
- Use long-form flags (`--option`) for clarity.

## YAML and Compose
- Indent with two spaces.
- Group environment variables alphabetically within each service.
- Reference shared volumes via descriptive names (e.g., `frigate_media`).

## Documentation
- Root manuals remain concise and link into the `/docs` directory.
- Mermaid diagrams should compile without external dependencies; store sources next to rendered assets.
- Include update notes in [`CHANGELOG.md`](../../CHANGELOG.md) when editing architecture or API contracts.

## Testing
- Run `make checks` before submitting pull requests that change scripts or Compose manifests.
- Tests live in `tests/` and can be invoked individually if needed.
