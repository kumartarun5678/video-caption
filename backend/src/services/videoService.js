import fs from 'fs/promises';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const OUTPUTS_DIR = path.join(process.cwd(), 'outputs');
const ensureDirectories = async () => {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.mkdir(OUTPUTS_DIR, { recursive: true });
};
export const uploadVideo = async (file) => {
    await ensureDirectories();
    const videoId = uuidv4();
    const fileExtension = path.extname(file.originalname) || '.mp4';
    const fileName = `${videoId}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    if (file.buffer) {
        await fs.writeFile(filePath, file.buffer);
    }
    else {
        throw new Error('File buffer is missing');
    }
    const metadata = await getVideoMetadata(filePath);
    const videoFile = {
        id: videoId,
        name: file.originalname,
        size: file.size,
        url: `/uploads/${fileName}`,
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        uploadedAt: new Date(),
    };
    return videoFile;
};
export const getVideoMetadata = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(new Error(`Failed to get video metadata: ${err.message}`));
                return;
            }
            const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
            const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');
            if (!videoStream) {
                reject(new Error('No video stream found'));
                return;
            }
            const videoMetadata = {
                duration: metadata.format.duration || 0,
                width: videoStream.width || 0,
                height: videoStream.height || 0,
                format: metadata.format.format_name || 'unknown',
                hasAudio: !!audioStream,
                bitrate: metadata.format.bit_rate ? Number(metadata.format.bit_rate) : 0,
                codec: videoStream.codec_name || 'unknown',
            };
            resolve(videoMetadata);
        });
    });
};
export const processVideo = async (videoId, operation) => {
    const videoPath = path.join(UPLOADS_DIR, `${videoId}.mp4`);
    if (!await fileExists(videoPath)) {
        throw new Error('Video file not found');
    }
    switch (operation) {
        case 'audio':
            const audioPath = path.join(UPLOADS_DIR, `${videoId}.wav`);
            await extractAudio(videoPath, audioPath);
            return audioPath;
        case 'thumbnail':
            const thumbnailPath = path.join(UPLOADS_DIR, `${videoId}-thumbnail.jpg`);
            await generateThumbnail(videoPath, thumbnailPath);
            return thumbnailPath;
        case 'preview':
            const previewPath = path.join(OUTPUTS_DIR, `${videoId}-preview.mp4`);
            await generatePreview(videoPath, previewPath);
            return previewPath;
        default:
            throw new Error(`Unsupported operation: ${operation}`);
    }
};
const extractAudio = (videoPath, audioPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .audioCodec('pcm_s16le')
            .audioFrequency(16000)
            .audioChannels(1)
            .format('wav')
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .save(audioPath);
    });
};
const generateThumbnail = (videoPath, thumbnailPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
            timestamps: ['00:00:01'],
            filename: path.basename(thumbnailPath),
            folder: path.dirname(thumbnailPath),
            size: '320x240'
        })
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
    });
};
const generatePreview = (videoPath, previewPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .duration(30) // 30-second preview
            .videoCodec('libx264')
            .audioCodec('aac')
            .size('640x360')
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .save(previewPath);
    });
};
const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
};