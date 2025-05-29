// routes/auth.ts
import express from 'express';
import { register, login, setPin } from '../controllers/auth';
import { authenticate } from '../middleware/auth';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/set-pin', authenticate, setPin);

export default router;
