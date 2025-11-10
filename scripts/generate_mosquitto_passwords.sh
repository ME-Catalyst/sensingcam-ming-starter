#!/usr/bin/env bash
# =============================================================================
# Purpose  : Generate the Mosquitto password database used by docker-compose.
# Usage    : ./scripts/generate_mosquitto_passwords.sh
# Notes    : Reads MOSQUITTO_USERNAME/MOSQUITTO_PASSWORD from the environment or
#            src/.env (if present) and writes the hashed credentials to
#            src/mosquitto/passwords.
# =============================================================================
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${PROJECT_ROOT}/src"
CONFIG_DIR="${SRC_DIR}/mosquitto"
PASSWORD_FILE="${CONFIG_DIR}/passwords"
export PASSWORD_FILE

if [[ -f "${SRC_DIR}/.env" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${SRC_DIR}/.env"
  set +a
fi

MOSQUITTO_USERNAME=${MOSQUITTO_USERNAME:-}
MOSQUITTO_PASSWORD=${MOSQUITTO_PASSWORD:-}

if [[ -z "${MOSQUITTO_USERNAME}" || -z "${MOSQUITTO_PASSWORD}" ]]; then
  echo "MOSQUITTO_USERNAME and MOSQUITTO_PASSWORD must be set in the environment or src/.env" >&2
  exit 1
fi

export MOSQUITTO_USERNAME MOSQUITTO_PASSWORD

mkdir -p "${CONFIG_DIR}"

echo "Generating Mosquitto password file at ${PASSWORD_FILE}" >&2

if command -v mosquitto_passwd >/dev/null 2>&1; then
  mosquitto_passwd -b -c "${PASSWORD_FILE}" "${MOSQUITTO_USERNAME}" "${MOSQUITTO_PASSWORD}"
else
  if command -v docker >/dev/null 2>&1; then
    docker run --rm \
      -v "${CONFIG_DIR}:/mosquitto" \
      eclipse-mosquitto:2 \
      mosquitto_passwd -b -c /mosquitto/passwords "${MOSQUITTO_USERNAME}" "${MOSQUITTO_PASSWORD}"
  else
    if ! command -v python3 >/dev/null 2>&1; then
      echo "mosquitto_passwd, docker, or python3 is required to create the password file." >&2
      exit 1
    fi
    python3 <<'PYTHON'
import base64
import hashlib
import os

password_file = os.environ["PASSWORD_FILE"]
username = os.environ["MOSQUITTO_USERNAME"]
password = os.environ["MOSQUITTO_PASSWORD"]

salt = os.urandom(12)
derived = hashlib.pbkdf2_hmac("sha512", password.encode("utf-8"), salt, 901)
record = "{}:PBKDF2$sha512$901${}${}\n".format(
    username,
    base64.b64encode(salt).decode("utf-8"),
    base64.b64encode(derived).decode("utf-8"),
)

with open(password_file, "w", encoding="utf-8") as handle:
    handle.write(record)
PYTHON
  fi
fi

chmod 600 "${PASSWORD_FILE}"

echo "Mosquitto password file generated successfully." >&2
