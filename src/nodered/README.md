# Node-RED flows

The provided `flows.json` bootstraps a sensingCam automation that:

1. Listens for anomaly events published to Mosquitto at `factory/line/+/event`.
2. Issues a REST call to the sensingCam to start an event recording.
3. Waits for Frigate to publish a clip completion event on `frigate/events`.
4. Persists the resulting video metadata to the `machine_events` measurement in InfluxDB.

Import the flow using the Node-RED editor menu (`Import > Clipboard`) or by copying it into `/data/flows.json` before starting the container.

## Required credentials

Set the following environment variables (see `../.env.example`) before deploying:

- `SICK_CAMERA_HOST`, `SICK_CAMERA_USERNAME`, `SICK_CAMERA_PASSWORD`
- InfluxDB organization, bucket, and token values
- Mosquitto username and password

## Extending the flow

- Add additional MQTT topics for PLC telemetry to enrich InfluxDB tags.
- Use the [node-red-rtsp-to-mjpeg](https://flows.nodered.org/node/@bartbutenaers/node-red-rtsp-to-mjpeg) node to restream the sensingCam feed for web dashboards.
- Publish acknowledgements to a PLC topic after the clip is saved to close the loop with machine controls.
