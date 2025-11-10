#!/usr/bin/env bash
# =============================================================================
# Purpose  : Run a smoke test across all docker-compose services to confirm
#            the local MING stack is healthy before development or demos.
# Usage    : [COMPOSE_CMD="docker compose"] [COMPOSE_FILE=src/docker-compose.yml]
#            ./scripts/verify_stack.sh
# Ownership: Platform Observability Team (observability@sensingcam.example)
# =============================================================================
set -euo pipefail

# Allow custom compose binaries (e.g., podman) and alternate compose files so
# the script mirrors the environment invoked by CI or bespoke deployments.
COMPOSE=${COMPOSE_CMD:-docker compose}
COMPOSE_FILE=${COMPOSE_FILE:-src/docker-compose.yml}

# mosquitto_pub ships in the mosquitto-clients package and is the simplest way
# to confirm the broker accepts connections; fail fast if it is unavailable.
if ! command -v mosquitto_pub >/dev/null 2>&1; then
  echo "mosquitto_pub is required to verify the MQTT broker. Install the mosquitto-clients package." >&2
  exit 1
fi

# Surface container state first so failures later in the script are easier to
# triage without running docker compose commands manually.
${COMPOSE} -f "${COMPOSE_FILE}" ps

# Publish an empty retained message to ensure the MQTT broker is reachable.
mosquitto_pub \
  -h "${MOSQUITTO_HOST:-localhost}" \
  -p "${MOSQUITTO_PORT:-1883}" \
  -t "${MOSQUITTO_HEALTH_TOPIC:-verify_stack/healthcheck}" \
  -n >/dev/null 2>&1 && \
  echo "Mosquitto broker reachable"

# Each HTTP probe uses curl with --fail to surface non-2xx responses as errors.
curl --silent --show-error --fail http://localhost:${NODERED_PORT:-1880} >/dev/null 2>&1 && \
  echo "Node-RED UI reachable"

curl --silent --show-error --fail http://localhost:${GRAFANA_PORT:-3000}/login >/dev/null 2>&1 && \
  echo "Grafana login reachable"

curl --silent --show-error --fail http://localhost:${FRIGATE_WEB_PORT:-8971}/api/version >/dev/null 2>&1 && \
  echo "Frigate API reachable"
