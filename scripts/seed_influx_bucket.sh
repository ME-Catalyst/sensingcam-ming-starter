#!/usr/bin/env bash
# =============================================================================
# Purpose  : Seed the InfluxDB bucket with a baseline sensingcam boot event so
#            dashboards and alerting rules have an initial data point.
# Usage    : INFLUXDB_ORG=... INFLUXDB_BUCKET=... INFLUXDB_TOKEN=... \
#            [INFLUX_URL=http://localhost:8086] ./scripts/seed_influx_bucket.sh
# Ownership: Platform Observability Team (observability@sensingcam.example)
# =============================================================================
set -euo pipefail

# Explicitly fail early when required credentials are missing so the script
# never reaches the write command with partial configuration.
: "${INFLUXDB_ORG:?INFLUXDB_ORG must be set}"
: "${INFLUXDB_BUCKET:?INFLUXDB_BUCKET must be set}"
: "${INFLUXDB_TOKEN:?INFLUXDB_TOKEN must be set}"

# Default to the local development endpoint but allow overrides for remote
# clusters (e.g., staging) without editing the script itself.
INFLUX_URL=${INFLUX_URL:-http://localhost:8086}

# The payload is piped directly into the CLI to avoid leaving artifacts on
# disk while still producing an event with a nanosecond timestamp.
cat <<POINTS | influx write \
  --bucket "${INFLUXDB_BUCKET}" \
  --org "${INFLUXDB_ORG}" \
  --token "${INFLUXDB_TOKEN}" \
  --precision ns \
  --host "${INFLUX_URL}"
machine_events,line=line-3,camera=sensingcam,event=boot video="/nvr/clips/bootstrap.mp4" $(date +%s%N)
POINTS
