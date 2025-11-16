import type { Caption } from '../../../shared/types/Caption.js';
import type { RenderJob } from '../../../shared/types/Render.js';
export declare const renderVideoWithCaptions: (videoId: string, captions: Caption[], style?: string, outputFormat?: string) => Promise<RenderJob>;
export declare const getRenderStatus: (renderId: string) => RenderJob;
export declare const downloadRenderedVideo: (renderId: string) => Promise<{
    downloadUrl: string;
    downloadPath: string;
}>;