import express from 'express';
import {
  renderVideoController,
  getRenderStatusController,
  downloadVideoController,
} from '../controllers/renderController.js';
import { validateRenderany } from '../middleware/validation.js';

const router = express.Router();

router.post('/video', validateRenderany, renderVideoController);
router.get('/status/:renderId', getRenderStatusController);
router.get('/download/:renderId', downloadVideoController);

export default router;