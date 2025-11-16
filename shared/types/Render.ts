import type { ApiResponse } from './Api.ts';
import type { Caption } from './Caption.ts';

export interface RenderJob {
  id: string;
  videoId: string;
  status: 'pending' | 'rendering' | 'completed' | 'failed';
  progress: number;
  outputPath: string;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  fileSize?: number;
}

export interface RenderRequest {
  videoUrl: string;
  captions: Caption[];
  style: string;
  outputFormat: 'mp4' | 'gif' | 'webm';
  quality?: number;
  resolution?: {
    width: number;
    height: number;
  };
}

export interface RenderResponse {
  renderId: string;
  status: 'rendering' | 'completed' | 'failed';
  downloadUrl?: string;
  progress?: number;
  estimatedTimeRemaining?: number;
}

// Render-specific API responses
export interface RenderStartResponse extends ApiResponse {
  data?: {
    renderId: string;
    status: string;
    estimatedTime: number;
  };
}

export interface RenderStatusResponse extends ApiResponse {
  data?: RenderJob;
}

export interface RenderDownloadResponse extends ApiResponse {
  data?: {
    downloadUrl: string;
    expiresAt: Date;
    fileSize: number;
  };
}