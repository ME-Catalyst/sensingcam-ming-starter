#!/usr/bin/env bash
set -euo pipefail

: "${INFLUXDB_ORG:?INFLUXDB_ORG must be set}"
: "${INFLUXDB_BUCKET:?INFLUXDB_BUCKET must be set}"
: "${INFLUXDB_TOKEN:?INFLUXDB_TOKEN must be set}"

INFLUX_URL=${INFLUX_URL:-http://localhost:8086}

cat <<POINTS | influx write \
  --bucket "${INFLUXDB_BUCKET}" \
  --org "${INFLUXDB_ORG}" \
  --token "${INFLUXDB_TOKEN}" \
  --precision ns \
  --host "${INFLUX_URL}"
machine_events,line=line-3,camera=sensingcam,event=boot video="/nvr/clips/bootstrap.mp4" $(date +%s%N)
POINTS
