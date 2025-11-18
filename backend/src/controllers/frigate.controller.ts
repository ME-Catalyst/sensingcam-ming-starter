import { Request, Response } from 'express';
import { frigateService } from '../services/frigate.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const getFrigateStatus = asyncHandler(async (_req: Request, res: Response) => {
  const version = await frigateService.getVersion();
  const stats = await frigateService.getStats();

  res.json({
    success: true,
    data: {
      version,
      stats,
      available: true,
    },
  });
});

export const getClips = asyncHandler(async (_req: Request, res: Response) => {
  const params = {
    camera: req.query.camera as string,
    label: req.query.label as string,
    after: req.query.after ? parseInt(req.query.after as string) : undefined,
    before: req.query.before ? parseInt(req.query.before as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
  };

  const clips = await frigateService.getEvents(params);

  res.json({
    success: true,
    data: clips,
    count: clips.length,
  });
});

export const getClipById = asyncHandler(async (_req: Request, res: Response) => {
  const { id } = req.params;
  const clip = await frigateService.getEvent(id);

  if (!clip) {
    throw ApiError.notFound('Clip not found');
  }

  res.json({
    success: true,
    data: clip,
  });
});

export const getClipUrl = asyncHandler(async (_req: Request, res: Response) => {
  const { id } = req.params;

  res.json({
    success: true,
    data: {
      clipUrl: frigateService.getClipUrl(id),
      snapshotUrl: frigateService.getSnapshotUrl(id),
      thumbnailUrl: frigateService.getThumbnailUrl(id),
    },
  });
});

export const downloadClip = asyncHandler(async (_req: Request, res: Response) => {
  const { id } = req.params;
  const buffer = await frigateService.downloadClip(id);

  res.set({
    'Content-Type': 'video/mp4',
    'Content-Disposition': `attachment; filename="clip_${id}.mp4"`,
  });
  res.send(buffer);
});

export const getCameras = asyncHandler(async (_req: Request, res: Response) => {
  const cameras = await frigateService.getCameras();

  res.json({
    success: true,
    data: cameras,
  });
});
