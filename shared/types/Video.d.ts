import type { ApiResponse } from './Api';
export interface VideoFile {
    id: string;
    name: string;
    size: number;
    url: string;
    duration: number;
    width: number;
    height: number;
    uploadedAt: Date;
    metadata?: VideoMetadata;
}
export interface VideoMetadata {
    duration: number;
    width: number;
    height: number;
    format: string;
    hasAudio: boolean;
    bitrate: number;
    codec: string;
    frameRate?: number;
    audioCodec?: string;
    audioSampleRate?: number;
    audioChannels?: number;
}
export interface VideoUploadState {
    file: File | null;
    isUploading: boolean;
    progress: number;
    error: string | null;
}
export interface VideoUploadResponse extends ApiResponse {
    data?: {
        video: VideoFile;
        uploadUrl: string;
    };
}
export interface VideoListResponse extends ApiResponse {
    data?: {
        videos: VideoFile[];
        total: number;
    };
}