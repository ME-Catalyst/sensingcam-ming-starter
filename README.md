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

## Resources

### Primary (Official SICK) Resources

- **Operating Instructions – sensingCam SEC100 / SEC110 (Full Manual, 2025-03)** (PDF, SICK)  
  Complete reference for setup, networking, ports/services (RTSP, MJPEG WS, SSH, NTP), REST API entry points, image capture, security notes, specs, and dimensional data. Essential baseline for integration and deployment.
- **Product Page – sensingCam SEC100 (Catalog + Downloads)** (Web page, SICK)  
  Official product hub with feature overview and the downloads tab (datasheets, manuals, accessories). Good jump-off for latest docs and firmware-adjacent material.
- **Datasheet – SEC110-5C9D1SFZZZZ (specs apply to sensingCam family)** (PDF, SICK)  
  Engineering-grade specs covering sensor resolution, FoV, frame rates, dual RTSP plus one MJPEG stream, power, and environmental characteristics. Handy when sizing bandwidth, storage, or lensing.
- **REST API of the sensingCam SEC100** (Knowledge article, support.sick.com)  
  Core doc for the on-device HTTP API: auth model (challenge/response), version-specific auth-free endpoints, defaults (passwords, fallback IP), and attachments with Postman/Insomnia collections and Python examples. Start here for programmatic control.
- **Download the deviceDescription.yaml (OpenAPI-style) from the Camera** (Knowledge article, support.sick.com)  
  Explains how to fetch the camera’s machine-readable API description (`/deviceDescription.yaml`) straight from the device (≥ FW 1.2.0) or via the Web UI (≥ FW 2.0.2). Perfect for code generation and client scaffolding.
- **TCP/IP Commands for sensingCam SEC100** (Knowledge article, support.sick.com)  
  Lightweight command interface (≥ FW 2.1.0) for snapshot/event triggers over raw TCP, including named snapshots—useful for PLC or edge gateways without full REST stacks.
- **RTSP Stream – How-To (VLC)** (Knowledge article, support.sick.com)  
  Walkthrough for enabling and configuring RTSP (resolution, frame rate, compression, bitrate, port/path), plus VLC settings to help validate stream parameters end-to-end.
- **sensingCam SEC100 – Knowledge Article Collection (FoV, Streaming Tips, etc.)** (Collection, support.sick.com)  
  Curated list featuring FoV calculation, stream settings and network load reduction, Wi-Fi display with TDC-E, image settings, and more—great for tuning performance in production.
- **Protocol & Integration: REST API (General SICK REST/OpenAPI Guide)** (Article + PDF, support.sick.com)  
  Broader SICK REST integration primer with patterns and example modules—useful backdrop when building generic clients or tools around SICK devices.
- **SICK AppSpace (SDK Docs + Developer Portal)** (SDK docs and developer portal, GitHub & SICK)  
  While sensingCam exposes REST and RTSP (not SensorApps), AppSpace docs, SDK notes, and algorithm API videos remain useful if you build across SICK ecosystems or embed UIs/algorithms on AppSpace devices.
- **Cybersecurity – SICK PSIRT (Security Advisories & Practices)** (PSIRT hub and cybersecurity guidance, SICK)  
  Official security advisories and hardening guidance—follow for vulnerability notices, mitigations, and general OT security recommendations for SICK devices.

### Official Sample Code & Utilities (SICK GitHub)

- **SICK Scan REST Client (Python)** (GitHub repository)  
  Minimal client showing read/write variables and method calls against SICK REST endpoints (challenge-response auth). Use it to understand request signing and flows before you roll your own.
- **SICK AG – GitHub Org (All Repos)** (GitHub organization)  
  Organization index. While many repos target LiDAR/3D/GigE Vision families, it is the canonical place to find new SDKs, samples, and tooling that can inform sensingCam integrations.

> **Tip:** The REST API article above includes downloadable Postman/Insomnia collections and Python example zip tailored specifically for sensingCam—grab those first. (support.sick.com)

## License

See [LICENSE](LICENSE).
