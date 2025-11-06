# sensingCam MING Starter

A reference stack for integrating the SICK sensingCam SEC110 into a MING edge deployment with Frigate as the recorder.

## Features

- Docker Compose orchestration for Mosquitto, Node-RED, InfluxDB, Grafana, and Frigate
- Pre-built Node-RED flow that triggers sensingCam recordings and stores clip metadata in InfluxDB
- Grafana provisioning that displays correlated events and embeds live restreams
- Utility scripts to test the camera API, seed InfluxDB, and verify service health

## Getting Started

1. Copy `.env.example` to `.env` and fill in credentials. Change all default passwords before use.
2. Create a persistent media directory for Frigate (default `./media`).
3. Launch the stack:

   ```bash
   docker compose up -d
   ```

4. Import `nodered/flows.json` using the Node-RED editor or mount it at `/data/flows.json`.
5. Open Grafana at `http://localhost:3000` (defaults: `admin` / `changeMe`).
6. Trigger an anomaly on the PLC topic or use `scripts/test_camera_api.sh` to ensure the camera responds.

## Scripts

- `scripts/test_camera_api.sh` – Exercises the sensingCam REST endpoint using HTTP digest auth.
- `scripts/seed_influx_bucket.sh` – Writes a sample point to InfluxDB for dashboard bootstrapping.
- `scripts/verify_stack.sh` – Checks container status and HTTP endpoints after deployment.

## Documentation

Additional design details are located under [`docs/`](docs):

- [ARCHITECTURE](docs/ARCHITECTURE.md)
- [NETWORKING](docs/NETWORKING.md)
- [SECURITY](docs/SECURITY.md)
- [ROADMAP](docs/ROADMAP.md)

## License

See [LICENSE](LICENSE).
