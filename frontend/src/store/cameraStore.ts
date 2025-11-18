import { create } from 'zustand';
import { cameraService } from '../services/camera.service';
import type { CameraStatus, RecordingRequest } from '../types';

interface CameraState {
  status: CameraStatus | null;
  streamUrl: string | null;
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;
  fetchStatus: () => Promise<void>;
  fetchStreamUrl: () => Promise<void>;
  startRecording: (params?: RecordingRequest) => Promise<void>;
  stopRecording: () => Promise<void>;
}

export const useCameraStore = create<CameraState>((set) => ({
  status: null,
  streamUrl: null,
  isRecording: false,
  isLoading: false,
  error: null,

  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const status = await cameraService.getStatus();
      set({ status, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch camera status';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStreamUrl: async () => {
    try {
      const streamUrl = await cameraService.getStreamUrl();
      set({ streamUrl });
    } catch (error: any) {
      console.error('Failed to fetch stream URL:', error);
    }
  },

  startRecording: async (params) => {
    set({ isLoading: true, error: null });
    try {
      await cameraService.startRecording(params);
      set({ isRecording: true, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to start recording';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  stopRecording: async () => {
    set({ isLoading: true, error: null });
    try {
      await cameraService.stopRecording();
      set({ isRecording: false, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to stop recording';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));
