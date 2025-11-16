import { transcribeAudio, generateCaptions, updateCaptions } from '../services/transcriptionService.js';
export const transcribeController = async (req, res, next) => {
    try {
        const { videoId, language = 'auto' } = req.body;
        if (!videoId) {
            res.status(400).json({
                success: false,
                error: 'Video ID is required',
            });
            return;
        }
        const transcription = await transcribeAudio(videoId, language);
        res.status(200).json({
            success: true,
            data: transcription,
            message: 'Transcription completed successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
export const generateCaptionsController = async (req, res, next) => {
    try {
        const { videoId, transcription, style = 'standard' } = req.body;
        if (!videoId || !transcription) {
            res.status(400).json({
                success: false,
                error: 'Video ID and transcription are required',
            });
            return;
        }
        const captions = await generateCaptions(videoId, transcription, style);
        res.status(200).json({
            success: true,
            data: captions,
            message: 'Captions generated successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateCaptionsController = async (req, res, next) => {
    try {
        const { videoId, captions } = req.body;
        if (!videoId || !captions) {
            res.status(400).json({
                success: false,
                error: 'Video ID and captions are required',
            });
            return;
        }
        const updatedCaptions = await updateCaptions(videoId, captions);
        res.status(200).json({
            success: true,
            data: updatedCaptions,
            message: 'Captions updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
};