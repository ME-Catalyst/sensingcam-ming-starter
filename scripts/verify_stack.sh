#!/usr/bin/env bash
set -euo pipefail

COMPOSE=${COMPOSE_CMD:-docker compose}
COMPOSE_FILE=${COMPOSE_FILE:-src/docker-compose.yml}

if ! command -v mosquitto_pub >/dev/null 2>&1; then
  echo "mosquitto_pub is required to verify the MQTT broker. Install the mosquitto-clients package." >&2
  exit 1
fi

${COMPOSE} -f "${COMPOSE_FILE}" ps

mosquitto_pub \
  -h "${MOSQUITTO_HOST:-localhost}" \
  -p "${MOSQUITTO_PORT:-1883}" \
  -t "${MOSQUITTO_HEALTH_TOPIC:-verify_stack/healthcheck}" \
  -n >/dev/null 2>&1 && \
  echo "Mosquitto broker reachable"

curl --silent --show-error --fail http://localhost:${NODERED_PORT:-1880} >/dev/null 2>&1 && \
  echo "Node-RED UI reachable"

curl --silent --show-error --fail http://localhost:${GRAFANA_PORT:-3000}/login >/dev/null 2>&1 && \
  echo "Grafana login reachable"

curl --silent --show-error --fail http://localhost:${FRIGATE_WEB_PORT:-8971}/api/version >/dev/null 2>&1 && \
  echo "Frigate API reachable"
