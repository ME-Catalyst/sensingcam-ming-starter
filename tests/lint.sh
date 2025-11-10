#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
YAMLLINT_CONFIG="$PROJECT_ROOT/tests/yamllint.yml"

if ! command -v yamllint >/dev/null 2>&1; then
  cat <<'MSG'
yamllint is required to lint YAML files.
Install it via your package manager (e.g. `pip install --user yamllint` or `apt-get install yamllint`).
MSG
  exit 1
fi

if ! command -v shellcheck >/dev/null 2>&1; then
  cat <<'MSG'
shellcheck is required to lint shell scripts.
Install it via your package manager (e.g. `apt-get install shellcheck`).
MSG
  exit 1
fi

YAML_TARGETS=(
  "$PROJECT_ROOT/src"
  "$PROJECT_ROOT/.github"
  "$PROJECT_ROOT/docs"
  "$PROJECT_ROOT/examples"
  "$PROJECT_ROOT/tests"
)

printf 'Running yamllint...\n'
yamllint -c "$YAMLLINT_CONFIG" "${YAML_TARGETS[@]}"

printf 'Running shellcheck...\n'
mapfile -t SHELL_FILES < <(find "$PROJECT_ROOT" -type f -name '*.sh' -not -path '*/.git/*' -print)

if ((${#SHELL_FILES[@]} > 0)); then
  shellcheck "${SHELL_FILES[@]}"
else
  printf 'No shell scripts found to lint.\n'
fi
