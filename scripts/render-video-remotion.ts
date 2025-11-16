import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import { bundle } from '@remotion/bundler';
import type { Caption } from '../shared/types/Caption.js';

interface RenderConfig {
  videoPath: string;
  captions: Caption[];
  style: string;
  outputPath: string;
}

export const renderVideoWithRemotion = async (
  config: RenderConfig
): Promise<void> => {
  const { videoPath, captions, style, outputPath } = config;

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  await fs.mkdir(outputDir, { recursive: true });

  // Bundle the Remotion project
  const bundleLocation = await bundle({
    entryPoint: path.resolve(__dirname, '../website/src/Root.tsx'),
    webpackOverride: (config) => config,
  });

  // Get video metadata for composition
  const videoUrl = `file://${videoPath}`;
  const videoDuration = await getVideoDuration(videoPath);
  const fps = 30;
  const durationInFrames = Math.ceil(videoDuration * fps);

  // Select the composition
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'VideoWithCaptions',
    inputProps: {
      videoUrl,
      captions,
      style,
    },
  });

  // Render the video
  await renderMedia({
    composition: {
      ...composition,
      durationInFrames,
      fps,
    },
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      videoUrl,
      captions,
      style,
    },
    onProgress: ({ renderedFrames, encodedFrames, renderedDoneIn, encodedDoneIn }) => {
      const progress = (renderedFrames / durationInFrames) * 100;
      console.log(`Rendering progress: ${progress.toFixed(2)}%`);
    },
  });

  console.log('Video rendered successfully:', outputPath);
};

const getVideoDuration = async (videoPath: string): Promise<number> => {
  // This is a simplified version - in production, use ffprobe
  // For now, return a default duration
  return 10; // This should be replaced with actual video duration detection
};

