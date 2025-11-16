import type { Caption, TranscriptionResult } from '../../../shared/types/Caption.js';
export declare const transcribeAudio: (videoId: string, language?: string) => Promise<TranscriptionResult>;
export declare const generateCaptions: (videoId: string, transcription: TranscriptionResult, style?: string) => Promise<Caption[]>;
export declare const updateCaptions: (videoId: string, captions: Caption[]) => Promise<Caption[]>;