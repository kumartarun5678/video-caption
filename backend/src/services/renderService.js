import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
const execAsync = promisify(exec);
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const OUTPUTS_DIR = path.join(process.cwd(), 'outputs');
const activeRenders = new Map();
export const renderVideoWithCaptions = async (videoId, captions, style = 'bottom-centered', outputFormat = 'mp4') => {
    const renderId = uuidv4();
    const videoPath = path.join(UPLOADS_DIR, `${videoId}.mp4`);
    const outputPath = path.join(OUTPUTS_DIR, `${renderId}.${outputFormat}`);
    if (!await fileExists(videoPath)) {
        throw new Error('Video file not found');
    }
    const renderJob = {
        id: renderId,
        videoId,
        status: 'rendering',
        progress: 0,
        outputPath,
        createdAt: new Date(),
        startedAt: new Date(),
    };
    activeRenders.set(renderId, renderJob);
    renderWithRemotion(videoPath, captions, style, outputPath, renderId);
    return renderJob;
};
export const getRenderStatus = (renderId) => {
    const renderJob = activeRenders.get(renderId);
    if (!renderJob) {
        throw new Error('Render job not found');
    }
    return renderJob;
};
export const downloadRenderedVideo = async (renderId) => {
    const renderJob = activeRenders.get(renderId);
    if (!renderJob) {
        throw new Error('Render job not found');
    }
    if (renderJob.status !== 'completed') {
        throw new Error('Video is not ready for download');
    }
    if (!await fileExists(renderJob.outputPath)) {
        throw new Error('Rendered video file not found');
    }
    return {
        downloadUrl: `/outputs/${path.basename(renderJob.outputPath)}`,
        downloadPath: renderJob.outputPath,
    };
};
const renderWithRemotion = async (videoPath, captions, style, outputPath, renderId) => {
    try {
        const renderJob = activeRenders.get(renderId);
        if (!renderJob)
            return;
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        const compositionConfig = {
            videoUrl: `file://${videoPath}`,
            captions,
            style,
        };
        const configPath = path.join(OUTPUTS_DIR, `${renderId}-config.json`);
        await fs.writeFile(configPath, JSON.stringify(compositionConfig, null, 2));
        const videoDuration = await getVideoDuration(videoPath);
        const fps = 30;
        const durationInFrames = Math.ceil(videoDuration * fps);
        const remotionCommand = `cd ${path.join(process.cwd(), '..', 'website')} && npx remotion render src/Root.tsx VideoWithCaptions --props='${configPath}' --codec=h264 --fps=${fps} --frames=0-${durationInFrames} ${outputPath}`;
        const progressInterval = setInterval(() => {
            if (renderJob.progress < 90) {
                renderJob.progress += 5;
            }
        }, 2000);
        await execAsync(remotionCommand);
        clearInterval(progressInterval);
        renderJob.status = 'completed';
        renderJob.progress = 100;
        renderJob.completedAt = new Date();
    }
    catch (error) {
        const renderJob = activeRenders.get(renderId);
        if (renderJob) {
            renderJob.status = 'failed';
            renderJob.error = error.message;
        }
        console.error('Rendering failed:', error);
    }
};
const getVideoDuration = async (videoPath) => {
    return new Promise((resolve, reject) => {
        const ffprobe = require('@ffprobe-installer/ffprobe');
        const { exec } = require('child_process');
        exec(`${ffprobe.path} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`, (error, stdout) => {
            if (error) {
                console.error('Error getting video duration:', error);
                resolve(10);
                return;
            }
            const duration = parseFloat(stdout.trim());
            resolve(isNaN(duration) ? 10 : duration);
        });
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