#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${SICK_CAMERA_HOST:-}" ]]; then
  echo "SICK_CAMERA_HOST is not set" >&2
  exit 1
fi

CAMERA_USER="${SICK_CAMERA_USERNAME:-main}"
CAMERA_PASS="${SICK_CAMERA_PASSWORD:-servicelevel}"

API_URL="http://${SICK_CAMERA_HOST}/api/v1/device"

curl --silent --show-error --fail --digest \
  -u "${CAMERA_USER}:${CAMERA_PASS}" \
  -H "Accept: application/json" \
  "$API_URL" | jq '.deviceInfo.model, .streams'
