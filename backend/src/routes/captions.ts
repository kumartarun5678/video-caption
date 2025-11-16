import express from 'express';
import {
  transcribeController,
  generateCaptionsController,
  updateCaptionsController,
} from '../controllers/captionController.js';
import { validateTranscriptionany } from '../middleware/validation.js';

const router = express.Router();

router.post('/transcribe', validateTranscriptionany, transcribeController);
router.post('/generate', generateCaptionsController);
router.put('/update', updateCaptionsController);

export default router;