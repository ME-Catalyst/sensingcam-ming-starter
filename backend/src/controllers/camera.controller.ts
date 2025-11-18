import { Request, Response } from 'express';
import { cameraService } from '../services/camera.service';
import { asyncHandler } from '../utils/asyncHandler';
import { RecordingRequest } from '../types';

export const getCameraStatus = asyncHandler(async (_req: Request, res: Response) => {
  const status = await cameraService.getStatus();

  res.json({
    success: true,
    data: status,
  });
});

export const startRecording = asyncHandler(async (_req: Request, res: Response) => {
  const params: RecordingRequest = {
    duration: req.body.duration,
    pre_roll: req.body.pre_roll,
    post_roll: req.body.post_roll,
  };

  const result = await cameraService.startRecording(params);

  res.json({
    success: true,
    data: result,
    message: 'Recording started successfully',
  });
});

export const stopRecording = asyncHandler(async (_req: Request, res: Response) => {
  const result = await cameraService.stopRecording();

  res.json({
    success: true,
    data: result,
    message: 'Recording stopped successfully',
  });
});

export const getDeviceInfo = asyncHandler(async (_req: Request, res: Response) => {
  const info = await cameraService.getDeviceInfo();

  res.json({
    success: true,
    data: info,
  });
});

export const getStreamUrl = asyncHandler(async (_req: Request, res: Response) => {
  const streamUrl = cameraService.getStreamUrl();

  res.json({
    success: true,
    data: {
      streamUrl,
    },
  });
});
