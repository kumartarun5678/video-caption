import { uploadVideo, getVideoMetadata, processVideo } from '../services/videoService.js';
import path from 'path';
import fs from 'fs';
export const uploadVideoController = async (req, res, next) => {
    try {
        if (!req.file) {
            const response = {
                success: false,
                error: 'No video file provided',
                statusCode: 400,
                timestamp: new Date().toISOString(),
            };
            res.status(400).json(response);
            return;
        }
        const videoInfo = await uploadVideo(req.file);
        const response = {
            success: true,
            data: {
                video: videoInfo,
                uploadUrl: videoInfo.url,
            },
            message: 'Video uploaded successfully',
            statusCode: 201,
            timestamp: new Date().toISOString(),
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const getVideoController = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const videoPath = path.join(__dirname, '../../uploads', `${videoId}.mp4`);
        if (!fs.existsSync(videoPath)) {
            const response = {
                success: false,
                error: 'Video not found',
                statusCode: 404,
                timestamp: new Date().toISOString(),
            };
            res.status(404).json(response);
            return;
        }
        const metadata = await getVideoMetadata(videoPath);
        const response = {
            success: true,
            data: {
                id: videoId,
                url: `/uploads/${videoId}.mp4`,
                metadata,
            },
            statusCode: 200,
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const extractAudioController = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const audioPath = await processVideo(videoId, 'audio');
        const response = {
            success: true,
            data: {
                audioUrl: `/uploads/${videoId}.wav`,
            },
            message: 'Audio extracted successfully',
            statusCode: 200,
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};