export const APP_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_FORMATS: ['video/mp4', 'video/quicktime'],
  SUPPORTED_LANGUAGES: ['en', 'hi', 'hinglish'],
  DEFAULT_CAPTION_STYLE: 'bottom-centered',
  RENDER_QUALITY: 80,
} as const;

export const API_ENDPOINTS = {
  UPLOAD: '/api/upload',
  TRANSCRIBE: '/api/transcribe',
  RENDER: '/api/render',
  DOWNLOAD: '/api/download',
  STATUS: '/api/status',
} as const;