export interface Caption {
  id: string;
  start: number;
  end: number;
  text: string;
  words?: Word[];
}

export interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
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
}

export interface TranscriptionResult {
  id: string;
  videoId: string;
  captions: Caption[];
  language: string;
  confidence: number;
  processedAt: Date;
  status: 'processing' | 'completed' | 'failed';
}