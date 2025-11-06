# sensingCam Configuration Guide

Practical tips for configuring the SICK sensingCam SEC110 before plugging it into the MING stack.

---

## Firmware & Access

1. Update to the latest stable firmware from SICK PSIRT portal.
2. Create dedicated accounts:
   - **API user** with minimal privileges for REST triggers.
   - **Maintenance user** for manual interventions.
3. Disable default `main` and `servicelevel` accounts once alternates confirmed.
4. Export the device configuration XML before making major changes.

---

## Stream Profiles

| Profile | Purpose | Suggested Settings |
|---------|---------|--------------------|
| Primary | Archival & analytics | H.265, 2592×1944 @ 20 fps, bitrate 8–12 Mbps, GOP 60. |
| Secondary | Dashboards / live restream | H.264, 1280×720 @ 8 fps, bitrate 2 Mbps, GOP 32. |
| Snapshot | Thumbnail / quick preview | JPEG, 1920×1080, quality 75. |

Adjust based on lighting and motion. Run the **SICK FoV tool** to confirm coverage before finalizing.

---

## Event Recording Parameters

```mermaid
flowchart LR
    Start[Event Triggered] --> Pre[Pre-roll Buffer]
    Pre --> Capture[Active Recording]
    Capture --> Post[Post-roll Duration]
    Post --> Upload[Clip Available]
```

- **Pre-roll**: Configure 10–15 seconds to capture context before the anomaly.
- **Post-roll**: 10 seconds is usually sufficient unless operators intervene manually.
- **Circular Buffer**: Keep buffer utilization below 80% to avoid overwriting pre-roll.

---

## REST API Tips

- Use HTTP Digest authentication; store nonce/cnonce management in Node-RED function node or external helper script.
- Fetch API schema: `https://<camera>/api/v1/deviceDescription.yaml` (requires firmware ≥ 1.2.0).
- Common endpoints:
  - `POST /api/v1/event/recording/start`
  - `POST /api/v1/event/recording/stop`
  - `GET /api/v1/event/recording/list`
  - `GET /api/v1/image/live`
- Monitor HTTP response headers for `X-SICK-Request-ID` to trace calls in camera logs.

---

## Diagnostics

| Symptom | Diagnostic Steps |
|---------|------------------|
| RTSP stutters | Reduce bitrate, verify network QoS, check for packet loss using `rtpstats`. |
| REST 401 errors | Recalculate digest auth headers, confirm clock sync via NTP. |
| Overheating alerts | Inspect camera vents, confirm ambient temperature within spec (datasheet), enable thermal alarms. |
| Blurry images | Clean lens, re-run focus routine, validate mount stability. |

---

## Maintenance Windows

- Schedule firmware updates during low production hours.
- Notify automation team before rebooting the camera to avoid false alarms.
- After updates, re-run `scripts/test_camera_api.sh` and validate Frigate stream connection.

---

## Reference Links

- [sensingCam Operating Instructions](https://www.auser.fi/wp-content/uploads/sensingcam-sec100-sec110-operating-instructions.pdf)
- [REST API Knowledge Base](https://support.sick.com/sick-knowledgebase/article/?code=KA-10054)
- [TCP Command Reference](https://support.sick.com/sick-knowledgebase/article/?id=af210c9a-f7d2-4a36-8c88-af345059230e)
- [deviceDescription.yaml Guide](https://support.sick.com/sick-knowledgebase/article/?code=KA-09939)

Keep this guide version-controlled; annotate settings with the date and reason for change to aid future audits.
