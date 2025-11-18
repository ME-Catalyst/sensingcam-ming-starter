import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

interface FrigateClip {
  id: string;
  camera: string;
  start_time: number;
  end_time: number;
  path: string;
  has_clip: boolean;
  has_snapshot: boolean;
}

interface FrigateStats {
  cameras: Record<string, any>;
  detectors: Record<string, any>;
  service: {
    uptime: number;
    version: string;
  };
}

class FrigateService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.frigate.url,
      timeout: 10000,
      headers: config.frigate.apiKey
        ? { Authorization: `Bearer ${config.frigate.apiKey}` }
        : {},
    });
  }

  /**
   * Get Frigate version and status
   */
  async getVersion(): Promise<string> {
    try {
      const response = await this.client.get('/api/version');
      return response.data.version || 'unknown';
    } catch (error) {
      logger.error('Failed to get Frigate version:', error);
      throw error;
    }
  }

  /**
   * Get Frigate statistics
   */
  async getStats(): Promise<FrigateStats> {
    try {
      const response = await this.client.get('/api/stats');
      return response.data;
    } catch (error) {
      logger.error('Failed to get Frigate stats:', error);
      throw error;
    }
  }

  /**
   * Get events/clips
   */
  async getEvents(params?: {
    camera?: string;
    label?: string;
    after?: number;
    before?: number;
    limit?: number;
  }): Promise<FrigateClip[]> {
    try {
      const response = await this.client.get('/api/events', { params });
      return response.data || [];
    } catch (error) {
      logger.error('Failed to get Frigate events:', error);
      throw error;
    }
  }

  /**
   * Get specific event details
   */
  async getEvent(eventId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get Frigate event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get clip URL
   */
  getClipUrl(eventId: string): string {
    return `${config.frigate.url}/api/events/${eventId}/clip.mp4`;
  }

  /**
   * Get snapshot URL
   */
  getSnapshotUrl(eventId: string): string {
    return `${config.frigate.url}/api/events/${eventId}/snapshot.jpg`;
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(eventId: string): string {
    return `${config.frigate.url}/api/events/${eventId}/thumbnail.jpg`;
  }

  /**
   * Download clip
   */
  async downloadClip(eventId: string): Promise<Buffer> {
    try {
      const response = await this.client.get(this.getClipUrl(eventId), {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      logger.error(`Failed to download clip ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Download snapshot
   */
  async downloadSnapshot(eventId: string): Promise<Buffer> {
    try {
      const response = await this.client.get(this.getSnapshotUrl(eventId), {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      logger.error(`Failed to download snapshot ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get available cameras
   */
  async getCameras(): Promise<string[]> {
    try {
      const stats = await this.getStats();
      return Object.keys(stats.cameras || {});
    } catch (error) {
      logger.error('Failed to get cameras:', error);
      throw error;
    }
  }

  /**
   * Check if Frigate is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.getVersion();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const frigateService = new FrigateService();
