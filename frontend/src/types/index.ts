// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  created_at: Date;
  updated_at: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'operator' | 'viewer';
}

// Event types
export interface MachineEvent {
  time: string;
  line: string;
  camera: string;
  event: string;
  video?: string;
  thumbnail?: string;
  duration_seconds?: number;
}

export interface EventQueryParams {
  start?: string;
  end?: string;
  line?: string;
  camera?: string;
  event?: string;
  limit?: number;
  offset?: number;
}

export interface EventStatistics {
  totalEvents: number;
}

// Frigate types
export interface FrigateClip {
  id: string;
  camera: string;
  start_time: number;
  end_time: number;
  path: string;
  has_clip: boolean;
  has_snapshot: boolean;
}

export interface FrigateStatus {
  version: string;
  stats: {
    cameras: Record<string, any>;
    detectors: Record<string, any>;
    service: {
      uptime: number;
      version: string;
    };
  };
  available: boolean;
}

// Camera types
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

// WebSocket event types
export interface FactoryEvent {
  line: string;
  station: string;
  severity: string;
  event: string;
  timestamp?: string;
}

export interface FrigateEvent {
  id: string;
  camera: string;
  label: string;
  type: string;
  after: {
    start_time: number;
    path?: string;
    thumbnail?: string;
  };
}
