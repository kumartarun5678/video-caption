import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';
import type { Caption } from '../../../shared/types/Caption.js';
import type { RenderJob } from '../../../shared/types/Render.js';

const execAsync = promisify(exec);
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const OUTPUTS_DIR = path.join(process.cwd(), 'outputs');

const activeRenders: Map<string, RenderJob> = new Map();

export const renderVideoWithCaptions = async (
  videoId: string,
  captions: Caption[],
  style: string = 'bottom-centered',
  outputFormat: string = 'mp4'
): Promise<RenderJob> => {
  const renderId = uuidv4();
  const videoPath = path.join(UPLOADS_DIR, `${videoId}.mp4`);
  const outputPath = path.join(OUTPUTS_DIR, `${renderId}.${outputFormat}`);

  if (!await fileExists(videoPath)) {
    throw new Error('Video file not found');
  }

  const renderJob: RenderJob = {
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

export const getRenderStatus = (renderId: string): RenderJob => {
  const renderJob = activeRenders.get(renderId);

  if (!renderJob) {
    throw new Error('Render job not found');
  }

  return renderJob;
};

export const downloadRenderedVideo = async (renderId: string): Promise<{ downloadUrl: string; downloadPath: string }> => {
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

const renderWithRemotion = async (
  videoPath: string,
  captions: Caption[],
  style: string,
  outputPath: string,
  renderId: string
): Promise<void> => {
  try {
    const renderJob = activeRenders.get(renderId);
    if (!renderJob) return;
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const videoDuration = await getVideoDuration(videoPath);
    const fps = 30;
    const durationInFrames = Math.ceil(videoDuration * fps);

    const websitePath = path.join(process.cwd(), '..', 'website');
    const entryPoint = path.join(websitePath, 'src', 'index.tsx');

    console.log('Bundling Remotion project...');
    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => {
        if (!config.resolve) {
          config.resolve = {};
        }
        if (!config.resolve.alias) {
          config.resolve.alias = {};
        }
        (config.resolve.alias as Record<string, string>)['@'] = websitePath;
        return config;
      },
    });

    const videoFileName = path.basename(videoPath);
    const backendPort = process.env.PORT || 5001;
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${backendPort}`;
    const videoUrl = `${backendUrl}/uploads/${videoFileName}`;

    if (!videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
      throw new Error(`Invalid video URL format: ${videoUrl}. Must be an HTTP/HTTPS URL.`);
    }


    const inputProps = {
      videoUrl: videoUrl,
      captions,
      style: style || 'bottom-centered',
    };

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'VideoWithCaptions',
      inputProps,
    });


    const renderInputProps = {
      videoUrl: videoUrl,
      captions,
      style: style || 'bottom-centered',
    };

    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps,
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: renderInputProps,
      timeoutInMilliseconds: 600000,
      concurrency: 4,
      onProgress: ({ renderedFrames, encodedFrames }) => {
        const totalFrames = durationInFrames;

        let progress = 0;
        if (renderedFrames >= totalFrames && encodedFrames > 0) {
          progress = 85 + ((encodedFrames / totalFrames) * 15);
        } else if (renderedFrames >= totalFrames) {
          progress = 85;
        } else {
          progress = (renderedFrames / totalFrames) * 85;
        }

        progress = Math.min(99, Math.max(0, progress));
        renderJob.progress = Math.round(progress);
        console.log(`Rendering progress: ${progress.toFixed(2)}% (Rendered: ${renderedFrames}/${totalFrames}, Encoded: ${encodedFrames}/${totalFrames})`);
      },
    });

    renderJob.status = 'completed';
    renderJob.progress = 100;
    renderJob.completedAt = new Date();

  } catch (error: any) {
    const renderJob = activeRenders.get(renderId);
    if (renderJob) {
      renderJob.status = 'failed';
      renderJob.error = error.message || String(error);
    }
    console.error('Rendering failed:', error);
  }
};

const getVideoDuration = async (videoPath: string): Promise<number> => {
  try {
    // @ts-ignore - @ffprobe-installer/ffprobe doesn't have TypeScript definitions
    const ffprobeInstaller = await import('@ffprobe-installer/ffprobe') as { default?: { path: string }; path?: string };
    const ffprobePath = ffprobeInstaller.default?.path || ffprobeInstaller.path;

    if (!ffprobePath) {
      throw new Error('FFprobe path not found');
    }

    const { stdout } = await execAsync(
      `${ffprobePath} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
    );
    const duration = parseFloat(stdout.trim());
    return isNaN(duration) ? 10 : duration;
  } catch (error) {
    console.error('Error getting video duration:', error);
    return 10;
  }
};

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};