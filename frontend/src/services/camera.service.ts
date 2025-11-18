import { api } from './api';
import type { APIResponse, CameraStatus, RecordingRequest } from '../types';

export const cameraService = {
  async getStatus(): Promise<CameraStatus> {
    const response = await api.get<APIResponse<CameraStatus>>('/camera/status');
    return response.data.data!;
  },

  async getStreamUrl(): Promise<string> {
    const response = await api.get<APIResponse<{ streamUrl: string }>>('/camera/stream');
    return response.data.data!.streamUrl;
  },

  async startRecording(params?: RecordingRequest): Promise<void> {
    await api.post('/camera/record/start', params);
  },

  async stopRecording(): Promise<void> {
    await api.post('/camera/record/stop');
  },

  async getDeviceInfo(): Promise<any> {
    const response = await api.get<APIResponse<any>>('/camera/device');
    return response.data.data!;
  },
};
