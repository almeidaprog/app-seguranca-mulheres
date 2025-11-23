import express from 'express';
import { 
  startListening, 
  stopListening, 
  getListeningStatus,
  getRecentRisks 
} from '../controllers/AIController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const aiRouter = express.Router();

aiRouter.post('/listen/start', requireAuth, startListening);
aiRouter.post('/listen/stop', requireAuth, stopListening);
aiRouter.get('/listen/status', requireAuth, getListeningStatus);
aiRouter.get('/risks', requireAuth, getRecentRisks);

export default aiRouter;