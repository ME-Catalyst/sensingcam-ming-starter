// Common types for the application

export interface MachineEvent {
  time: string;
  line: string;
  camera: string;
  event: string;
  video?: string;
  thumbnail?: string;
  duration_seconds?: number;
}

export interface FrigateEvent {
  id: string;
  camera: string;
  label: string;
  type: string;
  start_time: number;
  end_time?: number;
  after: {
    start_time: number;
    path?: string;
    thumbnail?: string;
  };
}

export interface CameraStatus {
  online: boolean;
  host: string;
  stream_url?: string;
  last_check: string;
}

export interface RecordingRequest {
  duration?: number;
  pre_roll?: number;
  post_roll?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'operator' | 'viewer';
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}

export interface MQTTMessage {
  topic: string;
  payload: any;
  timestamp: Date;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface TimeRangeParams {
  start?: string;
  end?: string;
}

export interface EventQueryParams extends PaginationParams, TimeRangeParams {
  line?: string;
  camera?: string;
  event?: string;
}
