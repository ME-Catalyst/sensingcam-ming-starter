# Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Camera firmware regression | High | Maintain tested firmware archive and validate in staging. |
| MQTT broker outage | Medium | Enable persistence and monitor container health via `scripts/verify_stack.sh`. |
| Storage saturation | High | Implement retention policies and offload clips nightly. |

Review and update before each release.
