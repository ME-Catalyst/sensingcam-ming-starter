#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${PROJECT_ROOT}/src"
COMPOSE_FILE="${SRC_DIR}/docker-compose.yml"
DOCKER_COMPOSE_BIN=${DOCKER_COMPOSE:-"docker compose"}
WAIT_TIMEOUT=${HEALTHCHECK_TIMEOUT:-180}
POLL_INTERVAL=${HEALTHCHECK_POLL_INTERVAL:-5}
SKIP_COMPOSE_TEST=${SKIP_COMPOSE_TEST:-0}

if [[ "$SKIP_COMPOSE_TEST" == "1" ]]; then
  echo "SKIP_COMPOSE_TEST is set; skipping compose stack validation."
  exit 0
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required to validate the compose stack." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "docker compose plugin is required to validate the compose stack." >&2
  exit 1
fi

pushd "$SRC_DIR" >/dev/null
TEMP_ENV_CREATED=0
if [[ ! -f .env ]]; then
  cp .env.example .env
  # Override hardware-specific defaults so CI runners can start containers.
  if command -v yq >/dev/null 2>&1; then
    yq -i '(.FRIGATE_TPU_DEVICE = "/dev/null") | (.FRIGATE_MEDIA_DIR = "./media-test")' .env
  else
    sed -i 's#^FRIGATE_TPU_DEVICE=.*#FRIGATE_TPU_DEVICE=/dev/null#' .env
    sed -i 's#^FRIGATE_MEDIA_DIR=.*#FRIGATE_MEDIA_DIR=./media-test#' .env
  fi
  TEMP_ENV_CREATED=1
fi
MEDIA_TEST_CREATED=0
if [[ ! -d media-test ]]; then
  mkdir -p media-test
  MEDIA_TEST_CREATED=1
fi

cleanup() {
  $DOCKER_COMPOSE_BIN -f "$COMPOSE_FILE" down --remove-orphans >/dev/null 2>&1 || true
  if [[ $TEMP_ENV_CREATED -eq 1 ]]; then
    rm -f "${SRC_DIR}/.env"
  fi
  if [[ $MEDIA_TEST_CREATED -eq 1 ]]; then
    rm -rf "${SRC_DIR}/media-test"
  fi
}
trap cleanup EXIT INT TERM

$DOCKER_COMPOSE_BIN -f "$COMPOSE_FILE" down --remove-orphans >/dev/null 2>&1 || true
if $DOCKER_COMPOSE_BIN up --help | grep -q -- '--wait'; then
  $DOCKER_COMPOSE_BIN -f "$COMPOSE_FILE" up -d --wait --wait-timeout "$WAIT_TIMEOUT"
else
  echo "docker compose '--wait' flag unavailable; falling back to manual health polling."
  $DOCKER_COMPOSE_BIN -f "$COMPOSE_FILE" up -d
fi

mapfile -t CONTAINER_IDS < <($DOCKER_COMPOSE_BIN -f "$COMPOSE_FILE" ps --quiet)

if ((${#CONTAINER_IDS[@]} == 0)); then
  echo "No containers discovered after compose up. Check $COMPOSE_FILE for service definitions." >&2
  exit 1
fi

evaluate_container() {
  local container_id="$1"
  local container_name status health
  container_name=$(docker inspect --format '{{.Name}}' "$container_id" | sed 's#^/##')
  status=$(docker inspect --format '{{.State.Status}}' "$container_id")
  health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$container_id")
  if [[ "$status" != "running" ]]; then
    echo "[FAIL] $container_name status is $status" >&2
    return 1
  fi
  if [[ "$health" != "none" && "$health" != "healthy" ]]; then
    echo "[FAIL] $container_name health is $health" >&2
    return 1
  fi
  echo "[OK] $container_name is $status (health: $health)"
  return 0
}

start_time=$(date +%s)
while true; do
  failures=0
  for cid in "${CONTAINER_IDS[@]}"; do
    if ! evaluate_container "$cid"; then
      ((failures++))
    fi
  done
  if ((failures == 0)); then
    echo "All containers are running and healthy."
    break
  fi
  now=$(date +%s)
  if (( now - start_time >= WAIT_TIMEOUT )); then
    echo "Containers failed to reach a healthy state within ${WAIT_TIMEOUT}s." >&2
    exit 1
  fi
  sleep "$POLL_INTERVAL"
done

popd >/dev/null
