#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"$PROJECT_ROOT/tests/lint.sh"
"$PROJECT_ROOT/tests/test_compose_stack.sh"
