import express from 'express';

import authRoutes from './server/auth/auth.route';

const router = express.Router();

// GET heartbeat of the server, verify if the service is alive
router.get('/heartbeat', (req, res) => res.send('OK'));

// Auth endpoints (both for web-interface and tools)
router.use('/auth', authRoutes);

export default router;
