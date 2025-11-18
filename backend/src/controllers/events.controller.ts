import { Request, Response } from 'express';
import { influxDBService } from '../services/influxdb.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { EventQueryParams } from '../types';

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const params: EventQueryParams = {
    start: req.query.start as string,
    end: req.query.end as string,
    line: req.query.line as string,
    camera: req.query.camera as string,
    event: req.query.event as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
  };

  const events = await influxDBService.queryEvents(params);

  res.json({
    success: true,
    data: events,
    count: events.length,
  });
});

export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await influxDBService.getEventById(id);

  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  res.json({
    success: true,
    data: event,
  });
});

export const getStatistics = asyncHandler(async (req: Request, res: Response) => {
  const start = (req.query.start as string) || '-24h';
  const end = (req.query.end as string) || 'now()';

  const stats = await influxDBService.getStatistics(start, end);

  res.json({
    success: true,
    data: stats,
  });
});
