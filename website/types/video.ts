export interface VideoFile {
  id: string;
  name: string;
  size: number;
  url: string;
  duration: number;
  width: number;
  height: number;
  uploadedAt: Date;
}

export interface VideoUploadState {
  file: File | null;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  format: string;
}