import { create } from 'zustand';
import { frigateService } from '../services/frigate.service';
import type { FrigateClip, FrigateStatus } from '../types';

interface FrigateState {
  clips: FrigateClip[];
  cameras: string[];
  status: FrigateStatus | null;
  isLoading: boolean;
  error: string | null;
  fetchClips: (params?: {
    camera?: string;
    label?: string;
    after?: number;
    before?: number;
    limit?: number;
  }) => Promise<void>;
  fetchCameras: () => Promise<void>;
  fetchStatus: () => Promise<void>;
  downloadClip: (id: string) => Promise<void>;
  clearClips: () => void;
}

export const useFrigateStore = create<FrigateState>((set) => ({
  clips: [],
  cameras: [],
  status: null,
  isLoading: false,
  error: null,

  fetchClips: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const clips = await frigateService.getClips(params);
      set({ clips, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch clips';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchCameras: async () => {
    try {
      const cameras = await frigateService.getCameras();
      set({ cameras });
    } catch (error: any) {
      console.error('Failed to fetch cameras:', error);
    }
  },

  fetchStatus: async () => {
    try {
      const status = await frigateService.getStatus();
      set({ status });
    } catch (error: any) {
      console.error('Failed to fetch Frigate status:', error);
    }
  },

  downloadClip: async (id: string) => {
    try {
      const blob = await frigateService.downloadClip(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clip_${id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to download clip:', error);
      throw error;
    }
  },

  clearClips: () => {
    set({ clips: [], error: null });
  },
}));
