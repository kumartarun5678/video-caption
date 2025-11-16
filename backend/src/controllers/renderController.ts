import { 
  renderVideoWithCaptions, 
  getRenderStatus,
  downloadRenderedVideo 
} from '../services/renderService.js';
import type { ApiResponse } from '../../../shared/types/Api.js'

export const renderVideoController = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { videoId, captions, style, outputFormat = 'mp4' } = req.body;

    if (!videoId || !captions) {
      res.status(400).json({
        success: false,
        error: 'Video ID and captions are required',
      } as ApiResponse<null>);
      return;
    }

    const renderJob = await renderVideoWithCaptions(
      videoId, 
      captions, 
      style, 
      outputFormat
    );
    
    res.status(202).json({
      success: true,
      data: renderJob,
      message: 'Video rendering started',
    } as ApiResponse<typeof renderJob>);
  } catch (error) {
    next(error);
  }
};

export const getRenderStatusController = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { renderId } = req.params;
    
    const status = await getRenderStatus(renderId);
    
    res.status(200).json({
      success: true,
      data: status,
    } as ApiResponse<typeof status>);
  } catch (error) {
    next(error);
  }
};

export const downloadVideoController = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { renderId } = req.params;
    
    const downloadInfo = await downloadRenderedVideo(renderId);
    const filePath = downloadInfo.downloadPath;
    res.download(filePath, (err: any) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};