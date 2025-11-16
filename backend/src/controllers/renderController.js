import { renderVideoWithCaptions, getRenderStatus, downloadRenderedVideo } from '../services/renderService.js';
export const renderVideoController = async (req, res, next) => {
    try {
        const { videoId, captions, style, outputFormat = 'mp4' } = req.body;
        if (!videoId || !captions) {
            res.status(400).json({
                success: false,
                error: 'Video ID and captions are required',
            });
            return;
        }
        const renderJob = await renderVideoWithCaptions(videoId, captions, style, outputFormat);
        res.status(202).json({
            success: true,
            data: renderJob,
            message: 'Video rendering started',
        });
    }
    catch (error) {
        next(error);
    }
};
export const getRenderStatusController = async (req, res, next) => {
    try {
        const { renderId } = req.params;
        const status = await getRenderStatus(renderId);
        res.status(200).json({
            success: true,
            data: status,
        });
    }
    catch (error) {
        next(error);
    }
};
export const downloadVideoController = async (req, res, next) => {
    try {
        const { renderId } = req.params;
        const downloadInfo = await downloadRenderedVideo(renderId);
        const filePath = downloadInfo.downloadPath;
        res.download(filePath, (err) => {
            if (err) {
                next(err);
            }
        });
    }
    catch (error) {
        next(error);
    }
};