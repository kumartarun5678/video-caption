
import { 
  transcribeAudio, 
  generateCaptions,
  updateCaptions 
} from '../services/transcriptionService.js';
import type { ApiResponse } from '../../../shared/types/Api.js';

export const transcribeController = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { videoId, language = 'auto' } = req.body;

    if (!videoId) {
      res.status(400).json({
        success: false,
        error: 'Video ID is required',
      } as ApiResponse<null>);
      return;
    }

    const transcription = await transcribeAudio(videoId, language);
    
    res.status(200).json({
      success: true,
      data: transcription,
      message: 'Transcription completed successfully',
    } as ApiResponse<typeof transcription>);
  } catch (error) {
    next(error);
  }
};

export const generateCaptionsController = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { videoId, transcription, style = 'standard' } = req.body;

    if (!videoId || !transcription) {
      res.status(400).json({
        success: false,
        error: 'Video ID and transcription are required',
      } as ApiResponse<null>);
      return;
    }

    const captions = await generateCaptions(videoId, transcription, style);
    
    res.status(200).json({
      success: true,
      data: captions,
      message: 'Captions generated successfully',
    } as ApiResponse<typeof captions>);
  } catch (error) {
    next(error);
  }
};

export const updateCaptionsController = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { videoId, captions } = req.body;

    if (!videoId || !captions) {
      res.status(400).json({
        success: false,
        error: 'Video ID and captions are required',
      } as ApiResponse<null>);
      return;
    }

    const updatedCaptions = await updateCaptions(videoId, captions);
    
    res.status(200).json({
      success: true,
      data: updatedCaptions,
      message: 'Captions updated successfully',
    } as ApiResponse<typeof updatedCaptions>);
  } catch (error) {
    next(error);
  }
};