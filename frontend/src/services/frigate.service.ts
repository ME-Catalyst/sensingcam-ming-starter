import { api } from './api';
import type { APIResponse, FrigateClip, FrigateStatus } from '../types';

export const frigateService = {
  async getStatus(): Promise<FrigateStatus> {
    const response = await api.get<APIResponse<FrigateStatus>>('/frigate/status');
    return response.data.data!;
  },

  async getCameras(): Promise<string[]> {
    const response = await api.get<APIResponse<string[]>>('/frigate/cameras');
    return response.data.data || [];
  },

  async getClips(params?: {
    camera?: string;
    label?: string;
    after?: number;
    before?: number;
    limit?: number;
  }): Promise<FrigateClip[]> {
    const response = await api.get<APIResponse<FrigateClip[]>>('/frigate/clips', { params });
    return response.data.data || [];
  },

  async getClip(id: string): Promise<FrigateClip> {
    const response = await api.get<APIResponse<FrigateClip>>(`/frigate/clips/${id}`);
    return response.data.data!;
  },

  async getClipUrls(id: string): Promise<{
    clipUrl: string;
    snapshotUrl: string;
    thumbnailUrl: string;
  }> {
    const response = await api.get<
      APIResponse<{
        clipUrl: string;
        snapshotUrl: string;
        thumbnailUrl: string;
      }>
    >(`/frigate/clips/${id}/url`);
    return response.data.data!;
  },

  async downloadClip(id: string): Promise<Blob> {
    const response = await api.get(`/frigate/clips/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
