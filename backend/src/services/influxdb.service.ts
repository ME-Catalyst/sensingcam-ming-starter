import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { config } from '../config';
import { logger } from '../utils/logger';
import { MachineEvent, EventQueryParams } from '../types';

class InfluxDBService {
  private client: InfluxDB;
  private queryApi: any;
  private writeApi: any;

  constructor() {
    this.client = new InfluxDB({
      url: config.influxdb.url,
      token: config.influxdb.token,
    });

    this.queryApi = this.client.getQueryApi(config.influxdb.org);
    this.writeApi = this.client.getWriteApi(
      config.influxdb.org,
      config.influxdb.bucket,
      'ns'
    );
  }

  /**
   * Query events from InfluxDB
   */
  async queryEvents(params: EventQueryParams): Promise<MachineEvent[]> {
    const {
      start = '-24h',
      end = 'now()',
      line,
      camera,
      event,
      limit = 100,
      offset = 0,
    } = params;

    let filters = '';
    if (line) filters += ` |> filter(fn: (r) => r.line == "${line}")`;
    if (camera) filters += ` |> filter(fn: (r) => r.camera == "${camera}")`;
    if (event) filters += ` |> filter(fn: (r) => r.event == "${event}")`;

    const query = `
      from(bucket: "${config.influxdb.bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r._measurement == "machine_events")
        ${filters}
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> limit(n: ${limit}, offset: ${offset})
        |> sort(columns: ["_time"], desc: true)
    `;

    try {
      const results: MachineEvent[] = [];

      await this.queryApi.queryRows(query, {
        next(row: any, tableMeta: any) {
          const record = tableMeta.toObject(row);
          results.push({
            time: record._time,
            line: record.line || '',
            camera: record.camera || '',
            event: record.event || '',
            video: record.video,
            thumbnail: record.thumbnail,
            duration_seconds: record.duration_seconds,
          });
        },
        error(error: Error) {
          logger.error('InfluxDB query error:', error);
          throw error;
        },
        complete() {
          logger.debug('InfluxDB query completed');
        },
      });

      return results;
    } catch (error) {
      logger.error('Failed to query InfluxDB:', error);
      throw error;
    }
  }

  /**
   * Get event by ID (using time as identifier)
   */
  async getEventById(time: string): Promise<MachineEvent | null> {
    const query = `
      from(bucket: "${config.influxdb.bucket}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "machine_events" and r._time == ${time})
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> limit(n: 1)
    `;

    try {
      let result: MachineEvent | null = null;

      await this.queryApi.queryRows(query, {
        next(row: any, tableMeta: any) {
          const record = tableMeta.toObject(row);
          result = {
            time: record._time,
            line: record.line || '',
            camera: record.camera || '',
            event: record.event || '',
            video: record.video,
            thumbnail: record.thumbnail,
            duration_seconds: record.duration_seconds,
          };
        },
        error(error: Error) {
          logger.error('InfluxDB query error:', error);
          throw error;
        },
        complete() {
          logger.debug('InfluxDB query completed');
        },
      });

      return result;
    } catch (error) {
      logger.error('Failed to get event by ID:', error);
      throw error;
    }
  }

  /**
   * Write an event to InfluxDB
   */
  async writeEvent(event: Omit<MachineEvent, 'time'>): Promise<void> {
    try {
      const point = new Point('machine_events')
        .tag('line', event.line)
        .tag('camera', event.camera)
        .tag('event', event.event);

      if (event.video) point.stringField('video', event.video);
      if (event.thumbnail) point.stringField('thumbnail', event.thumbnail);
      if (event.duration_seconds) point.floatField('duration_seconds', event.duration_seconds);

      this.writeApi.writePoint(point);
      await this.writeApi.flush();

      logger.info('Event written to InfluxDB:', event);
    } catch (error) {
      logger.error('Failed to write event to InfluxDB:', error);
      throw error;
    }
  }

  /**
   * Get aggregated statistics
   */
  async getStatistics(start = '-24h', end = 'now()') {
    const query = `
      from(bucket: "${config.influxdb.bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r._measurement == "machine_events")
        |> group()
        |> count()
    `;

    try {
      let count = 0;

      await this.queryApi.queryRows(query, {
        next(row: any, tableMeta: any) {
          const record = tableMeta.toObject(row);
          count = record._value || 0;
        },
        error(error: Error) {
          logger.error('InfluxDB statistics query error:', error);
          throw error;
        },
        complete() {
          logger.debug('InfluxDB statistics query completed');
        },
      });

      return { totalEvents: count };
    } catch (error) {
      logger.error('Failed to get statistics:', error);
      throw error;
    }
  }

  /**
   * Close connection
   */
  async close() {
    try {
      await this.writeApi.close();
      logger.info('InfluxDB connection closed');
    } catch (error) {
      logger.error('Error closing InfluxDB connection:', error);
    }
  }
}

export const influxDBService = new InfluxDBService();
