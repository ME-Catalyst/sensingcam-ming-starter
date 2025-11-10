#!/usr/bin/env bash
# =============================================================================
# Purpose  : Exercise the SICK camera REST API to confirm connectivity and
#            credentials before the Frigate pipeline attempts to ingest video.
# Usage    : SICK_CAMERA_HOST=... [SICK_CAMERA_USERNAME=main] \
#            [SICK_CAMERA_PASSWORD=servicelevel] ./scripts/test_camera_api.sh
# Ownership: Edge Vision Team (edge-vision@sensingcam.example)
# =============================================================================
set -euo pipefail

# The camera host is the only hard requirement; default credentials are valid
# for the demo firmware but can be overridden for hardened deployments.
if [[ -z "${SICK_CAMERA_HOST:-}" ]]; then
  echo "SICK_CAMERA_HOST is not set" >&2
  exit 1
fi

CAMERA_USER="${SICK_CAMERA_USERNAME:-main}"
CAMERA_PASS="${SICK_CAMERA_PASSWORD:-servicelevel}"

# Base URL for the device metadata endpoint exposed by the camera firmware.
API_URL="http://${SICK_CAMERA_HOST}/api/v1/device"

# The camera requires HTTP Digest authentication; jq filters the response to
# the most actionable fields so the script can double as a quick status probe.
curl --silent --show-error --fail --digest \
  -u "${CAMERA_USER}:${CAMERA_PASS}" \
  -H "Accept: application/json" \
  "$API_URL" | jq '.deviceInfo.model, .streams'
