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

| Title                                                             | Description                                                                                                                                | Link |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| **Operating Instructions – sensingCam SEC100 / SEC110 (2025-03)** | Full installation, configuration, network services (RTSP, MJPEG, SSH, NTP), REST API overview, image handling, and technical specs.        | [https://www.auser.fi/wp-content/uploads/sensingcam-sec100-sec110-operating-instructions.pdf](https://www.auser.fi/wp-content/uploads/sensingcam-sec100-sec110-operating-instructions.pdf) |
| **Product Page – sensingCam SEC100**                              | Official catalog entry with overview, accessories, firmware, datasheets, and manuals under the *Downloads* tab.                            | [https://www.sick.com/au/en/products/machine-vision-and-identification/machine-vision/sensingcam-sec100/c/g601993?tab=downloads](https://www.sick.com/au/en/products/machine-vision-and-identification/machine-vision/sensingcam-sec100/c/g601993?tab=downloads) |
| **Datasheet – SEC110-5C9D1SFZZZZ (1144993)**                      | Electrical, mechanical, optical, and environmental specifications for the sensingCam family.                                               | [https://www.sick.com/media/pdf/0/20/220/dataSheet_SEC110-5C9D1SFZZZZ_1144993_en.pdf](https://www.sick.com/media/pdf/0/20/220/dataSheet_SEC110-5C9D1SFZZZZ_1144993_en.pdf) |
| **REST API of the sensingCam SEC100**                             | Core developer reference for HTTP API endpoints, challenge-response auth, and downloadable Postman/Insomnia collections + Python examples. | [https://support.sick.com/sick-knowledgebase/article/?code=KA-10054](https://support.sick.com/sick-knowledgebase/article/?code=KA-10054) |
| **deviceDescription.yaml (Download Guide)**                       | Explains how to retrieve the OpenAPI-style YAML from the camera (≥ FW 1.2.0 via HTTP or ≥ 2.0.2 via Web UI) for code generation.           | [https://support.sick.com/sick-knowledgebase/article/?code=KA-09939](https://support.sick.com/sick-knowledgebase/article/?code=KA-09939) |
| **TCP/IP Commands for sensingCam SEC100**                         | Documents raw TCP command protocol (≥ FW 2.1.0) for snapshots/events; ideal for PLC/edge use cases.                                        | [https://support.sick.com/sick-knowledgebase/article/?id=af210c9a-f7d2-4a36-8c88-af345059230e](https://support.sick.com/sick-knowledgebase/article/?id=af210c9a-f7d2-4a36-8c88-af345059230e) |
| **RTSP Stream Setup (VLC How-To)**                                | Step-by-step RTSP configuration guide (resolution, bitrate, frame rate) and VLC examples.                                                  | [https://support.sick.com/sick-knowledgebase/article/?id=69a3d053-2cc1-4d33-ad9e-6986c65d5aca](https://support.sick.com/sick-knowledgebase/article/?id=69a3d053-2cc1-4d33-ad9e-6986c65d5aca) |
| **Knowledge Article Collection – sensingCam Family**              | Central index of FoV tools, stream tuning, Wi-Fi display, image settings, and network optimization guides.                                 | [https://support.sick.com/knowledgebase/knowledge-articles/?gr0id=2065641c-a69b-ee11-be37-6045bd8c5a94&gr1id=31329239-a69b-ee11-be37-6045bdf3fa4f&gr2id=cd7ae574-bf7e-ef11-ac21-7c1e5251951a](https://support.sick.com/knowledgebase/knowledge-articles/?gr0id=2065641c-a69b-ee11-be37-6045bd8c5a94&gr1id=31329239-a69b-ee11-be37-6045bdf3fa4f&gr2id=cd7ae574-bf7e-ef11-ac21-7c1e5251951a) |
| **REST API (OpenAPI) Integration Primer for SICK Devices**        | Generic REST/OpenAPI implementation guide and patterns for SICK devices.                                                                   | [https://support.sick.com/sick-knowledgebase/article/?code=KA-09665](https://support.sick.com/sick-knowledgebase/article/?code=KA-09665) |
| **SICK AppSpace (SDK Docs + Developer Portal)**                   | SDK and developer portal for SICK ecosystem; useful for cross-device projects and AppSpace-enabled workflows.                              | [https://github.com/SICKAG/SICK-AppSpace-SDK-Docs](https://github.com/SICKAG/SICK-AppSpace-SDK-Docs)  •  [https://www.sick.com/de/en/sick-appspace-developers/s/sas-developers](https://www.sick.com/de/en/sick-appspace-developers/s/sas-developers) |
| **SICK PSIRT (Security Advisories + Practices)**                  | Official product security updates and hardening guidelines for SICK industrial devices.                                                    | [https://www.sick.com/cz/en/service-and-support/the-sick-product-security-incident-response-team-sick-psirt/w/psirt](https://www.sick.com/cz/en/service-and-support/the-sick-product-security-incident-response-team-sick-psirt/w/psirt)  •  [https://www.sick.com/cz/en/cybersecurity/s/cybersecurity/](https://www.sick.com/cz/en/cybersecurity/s/cybersecurity/) |

### Official Sample Code & Utilities (SICK GitHub)

| Title                              | Description                                                                                                                                  | Link |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| **SICK Scan REST Client (Python)** | Example client for SICK REST interfaces – auth flow, read/write variables, method calls – a great starting point for sensingCam integration. | [https://github.com/SICKAG/sick_scan_rest_client](https://github.com/SICKAG/sick_scan_rest_client) |
| **SICK AG – GitHub Organization**  | Index of all SICK AG open-source SDKs, samples, and integration tools.                                                                       | [https://github.com/SICKAG](https://github.com/SICKAG) |

> **Tip:** The REST API article above includes downloadable Postman/Insomnia collections and Python example zip tailored specifically for sensingCam—grab those first. (support.sick.com)

## License

See [LICENSE](LICENSE).
