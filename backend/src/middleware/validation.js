export const validateVideoUpload = (req, res, next) => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            error: 'No video file provided',
        });
        return;
    }
    if (req.file.size > 100 * 1024 * 1024) {
        res.status(400).json({
            success: false,
            error: 'File size exceeds 100MB limit',
        });
        return;
    }
    next();
};
export const validateTranscriptionany = (req, res, next) => {
    const { videoId, language } = req.body;
    if (!videoId) {
        res.status(400).json({
            success: false,
            error: 'Video ID is required',
        });
        return;
    }
    if (language && typeof language !== 'string') {
        res.status(400).json({
            success: false,
            error: 'Language must be a string',
        });
        return;
    }
    next();
};
export const validateRenderany = (req, res, next) => {
    const { videoId, captions, style, outputFormat } = req.body;
    if (!videoId) {
        res.status(400).json({
            success: false,
            error: 'Video ID is required',
        });
        return;
    }
    if (!captions || !Array.isArray(captions)) {
        res.status(400).json({
            success: false,
            error: 'Captions array is required',
        });
        return;
    }
    if (outputFormat && !['mp4', 'gif'].includes(outputFormat)) {
        res.status(400).json({
            success: false,
            error: 'Output format must be mp4 or gif',
        });
        return;
    }
    next();
};