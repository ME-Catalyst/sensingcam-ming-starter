# Recovery Procedures

## Credential Rotation
1. Generate new passwords for the sensingCam, MQTT broker, Grafana, and InfluxDB.
2. Update `src/.env` and redeploy the stack with `docker compose -f src/docker-compose.yml up -d`.
3. Reimport Node-RED flows if environment variables changed.

## Data Restoration
1. Stop the stack (`docker compose -f src/docker-compose.yml down`).
2. Restore InfluxDB backups using `influx restore` commands.
3. Copy Frigate media archives back into the `./media` volume.
4. Start the stack and verify dashboards.

## Incident Response
- Document incidents in `docs/roadmap/risks.md`.
- Update [`CHANGELOG.md`](../../CHANGELOG.md) if the remediation impacts released functionality.
