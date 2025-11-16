import { Caption } from '@/types/captions';
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  videoId: string;
  url: string;
  metadata: {
    duration: number;
    width: number;
    height: number;
    size: number;
  };
}

export interface TranscribeResponse {
  transcriptionId: string;
  status: 'processing' | 'completed';
  captions?: Caption[];
}

export interface RenderRequest {
  videoUrl: string;
  captions: Caption[];
  style: string;
  outputFormat: 'mp4' | 'gif';
}

export interface RenderResponse {
  renderId: string;
  status: 'rendering' | 'completed' | 'failed';
  downloadUrl?: string;
}