#!/usr/bin/env bash
set -euo pipefail

COMPOSE=${COMPOSE_CMD:-docker compose}

${COMPOSE} ps

curl --silent --show-error --fail http://localhost:${MOSQUITTO_PORT:-1883} >/dev/null 2>&1 && \
  echo "Mosquitto port open"

curl --silent --show-error --fail http://localhost:${NODERED_PORT:-1880} >/dev/null 2>&1 && \
  echo "Node-RED UI reachable"

curl --silent --show-error --fail http://localhost:${GRAFANA_PORT:-3000}/login >/dev/null 2>&1 && \
  echo "Grafana login reachable"

curl --silent --show-error --fail http://localhost:${FRIGATE_WEB_PORT:-8971}/api/version >/dev/null 2>&1 && \
  echo "Frigate API reachable"
