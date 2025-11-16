import type { VideoFile, VideoMetadata } from '../../../shared/types/Video.js';
export declare const uploadVideo: (file: Express.Multer.File) => Promise<VideoFile>;
export declare const getVideoMetadata: (filePath: string) => Promise<VideoMetadata>;
export declare const processVideo: (videoId: string, operation: "audio" | "thumbnail" | "preview") => Promise<string>;