# Installation Guide

1. **Clone** – `git clone https://github.com/ME-Catalyst/sensingcam-ming-starter.git && cd sensingcam-ming-starter`.
2. **Prepare Environment** – Ensure Docker Engine 24+ and Compose Plugin are available. Install `mosquitto-clients`, `curl`, and `jq`.
3. **Configure** – Copy `src/.env.example` to `src/.env`. Provide camera hostnames, MQTT credentials, and Grafana admin settings.
4. **Generate MQTT password file** – Execute `scripts/generate_mosquitto_passwords.sh` so Mosquitto can load the hashed credentials referenced by docker-compose.
5. **Review Frigate** – Edit `src/frigate/config.yml` with RTSP URLs, recording retention, and hardware acceleration parameters.
6. **Start Stack** – `docker compose -f src/docker-compose.yml up -d`.
7. **Verify** – Run `scripts/verify_stack.sh` to check service health.
8. **Exercise Camera** – Set `SICK_CAMERA_HOST` and execute `scripts/test_camera_api.sh` to confirm REST connectivity.

For offline installations, mirror container images ahead of time and point `DOCKER_REGISTRY_MIRROR` to your internal registry.
