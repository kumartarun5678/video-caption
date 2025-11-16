import express from 'express';
import { uploadVideoController, getVideoController, extractAudioController, } from '../controllers/videoController.js';
import { uploadSingle } from '../middleware/upload.js';
import { validateVideoUpload } from '../middleware/validation.js';
const router = express.Router();
router.post('/upload', uploadSingle, validateVideoUpload, uploadVideoController);
router.get('/:videoId', getVideoController);
router.post('/:videoId/extract-audio', extractAudioController);
export default router;