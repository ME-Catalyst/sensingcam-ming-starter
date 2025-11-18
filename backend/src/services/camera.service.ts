import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { RecordingRequest, CameraStatus } from '../types';

class CameraService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${config.camera.protocol}://${config.camera.host}`;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      auth: {
        username: config.camera.username,
        password: config.camera.password,
      },
    });
  }

  /**
   * Start event recording on camera
   */
  async startRecording(params?: RecordingRequest): Promise<any> {
    try {
      const response = await this.client.post('/api/v1/event/recording/start', {
        duration: params?.duration || 30,
        pre_roll: params?.pre_roll || 5,
        post_roll: params?.post_roll || 5,
      });

      logger.info('Camera recording started:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Failed to start camera recording:', error);
      throw error;
    }
  }

  /**
   * Stop event recording on camera
   */
  async stopRecording(): Promise<any> {
    try {
      const response = await this.client.post('/api/v1/event/recording/stop');
      logger.info('Camera recording stopped:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Failed to stop camera recording:', error);
      throw error;
    }
  }

  /**
   * Get camera device information
   */
  async getDeviceInfo(): Promise<any> {
    try {
      const response = await this.client.get('/api/v1/device');
      return response.data;
    } catch (error) {
      logger.error('Failed to get camera device info:', error);
      throw error;
    }
  }

  /**
   * Get camera status
   */
  async getStatus(): Promise<CameraStatus> {
    try {
      await this.getDeviceInfo();
      return {
        online: true,
        host: config.camera.host,
        stream_url: `rtsp://${config.camera.username}:${config.camera.password}@${config.camera.host}/stream1`,
        last_check: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Camera offline or unreachable:', error);
      return {
        online: false,
        host: config.camera.host,
        last_check: new Date().toISOString(),
      };
    }
  }

  /**
   * Check if camera is reachable
   */
  async isOnline(): Promise<boolean> {
    try {
      await this.getDeviceInfo();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get RTSP stream URL
   */
  getStreamUrl(): string {
    return `rtsp://${config.camera.username}:${config.camera.password}@${config.camera.host}/stream1`;
  }
}

export const cameraService = new CameraService();
