// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'sensingcam_token',
  REFRESH_TOKEN: 'sensingcam_refresh_token',
  USER: 'sensingcam_user',
  THEME: 'sensingcam_theme',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EVENTS: '/events',
  CLIPS: '/clips',
  ANALYTICS: '/analytics',
  CAMERA: '/camera',
  SETTINGS: '/settings',
} as const;

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
} as const;

// Event Types
export const EVENT_TYPES = [
  'stop',
  'fault',
  'warning',
  'normal',
  'boot',
] as const;

// Event Severity
export const EVENT_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
} as const;

// Time Ranges
export const TIME_RANGES = [
  { label: 'Last Hour', value: '-1h' },
  { label: 'Last 6 Hours', value: '-6h' },
  { label: 'Last 24 Hours', value: '-24h' },
  { label: 'Last 7 Days', value: '-7d' },
  { label: 'Last 30 Days', value: '-30d' },
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 50;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
