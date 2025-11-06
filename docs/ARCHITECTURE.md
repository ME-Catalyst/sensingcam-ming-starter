# sensingCam MING Starter Architecture

The starter stack connects a SICK sensingCam SEC110 to a MING (MQTT, InfluxDB, Node-RED, Grafana) edge deployment together with Frigate as the NVR.

## Components

- **sensingCam SEC110** – ruggedized 5 MP IP sensor delivering dual RTSP streams, MJPEG preview, and a REST API for snapshots/event clips.
- **Mosquitto** – MQTT broker for PLC/sensor telemetry and Frigate event topics.
- **Node-RED** – orchestrates camera triggers and converts NVR notifications into structured time-series points.
- **InfluxDB 2.x** – stores `machine_events` measurement with video metadata for long-term correlation.
- **Grafana** – visualizes machine events alongside embedded live streams and clip links.
- **Frigate** – OSS NVR that records the sensingCam stream, publishes clip metadata to MQTT, and serves restream endpoints.

## Event Sequence

1. A PLC or auxiliary sensor publishes an anomaly message (e.g., stop/fault) to Mosquitto.
2. Node-RED detects the event and invokes `POST /api/v1/event/recording/start` on the sensingCam.
3. The camera leverages its 6 GB circular buffer to capture pre/post-roll video while streaming RTSP to Frigate.
4. Once Frigate finalizes the clip it publishes a `frigate/events` MQTT payload including file paths.
5. Node-RED writes a `machine_events` point to InfluxDB containing tags for production line, camera, and event type plus the clip URI.
6. Grafana dashboards query InfluxDB (Flux) to display machine state and provide hyperlinks to the Frigate media files.

## Stream Strategy

- Primary stream: 5 MP H.264/H.265 reserved for archival via Frigate.
- Secondary stream: 720p @ ~8 fps for analytics or dashboards; transcode with Node-RED RTSP-to-MJPEG if needed.
- Adjust bitrate, codec, and fps per SICK guidance to balance bandwidth and inference load.

## Deployment

Docker Compose provisions the services with shared `.env` settings. The sensingCam resides on a camera VLAN while the containers run in an application VLAN. Frigate mounts a persistent media directory that Grafana references for clip playback.
