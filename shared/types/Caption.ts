import type { ApiResponse } from './Api.ts';

export interface Caption {
  id: string;
  start: number;
  end: number;
  text: string;
  words?: Word[];
  style?: CaptionStyleConfig;
}

export interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: string;
}

export interface TranscriptionResult {
  id: string;
  videoId: string;
  captions: Caption[];
  language: string;
  confidence: number;
  processedAt: Date;
  status: 'processing' | 'completed' | 'failed';
  duration?: number;
}

export interface CaptionStyle {
  id: string;
  name: string;
  description: string;
  component: string;
  config: CaptionStyleConfig;
}

export interface CaptionStyleConfig {
  position: 'bottom' | 'top' | 'middle';
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  padding: number;
  borderRadius: number;
  maxWidth: number;
  textAlign: 'left' | 'center' | 'right';
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
  shadow?: string;
}

export interface TranscriptionResponse extends ApiResponse {
  data?: TranscriptionResult;
}

export interface CaptionGenerationResponse extends ApiResponse {
  data?: {
    captions: Caption[];
    style: string;
    videoId: string;
  };
}

export interface CaptionUpdateResponse extends ApiResponse {
  data?: {
    captions: Caption[];
    updatedAt: Date;
  };
}