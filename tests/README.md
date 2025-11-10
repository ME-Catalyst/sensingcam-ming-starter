# Tests

This directory now houses runnable automation for day-to-day validation:

- `tests/lint.sh` runs [yamllint](https://yamllint.readthedocs.io/) and [ShellCheck](https://www.shellcheck.net/) against the
  repository. The yamllint rules live in `tests/yamllint.yml` and expand the default line-length to 120 columns so existing
  compose manifests remain readable.
- `tests/test_compose_stack.sh` brings up `src/docker-compose.yml`, waits for the services to report `running`/`healthy`, and
  fails if any container stops prematurely. It generates a temporary `.env` file from `src/.env.example` when none is present so
  CI runners do not require secrets.
- `tests/run.sh` orchestrates both checks and is the entry point used by `make checks` and CI.

## Usage

```bash
# Lint YAML + shell scripts
make lint

# Spin up the docker-compose stack and verify container health
make test

# Run everything (used by CI/CD and local verification)
make checks
```

Set `SKIP_COMPOSE_TEST=1 make test` if you are on a workstation without Docker available; the compose validation will be skipped
but linting will still execute.
