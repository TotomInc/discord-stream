import express from 'express';

import authRoutes from './server/auth/auth.route';
import loginRoutes from './server/login/login.route';
import usersRoutes from './server/user/user.route';

const router = express.Router();

// GET heartbeat of the server, verify if the service is alive
router.get('/heartbeat', (req, res) => res.send('OK'));

// Auth endpoints that generate a JWT
router.use('/auth', authRoutes);

// Login endpoints used by the web-interface using OAuth
router.use('/login', loginRoutes);

// Users endpoints
router.use('/users', usersRoutes);

export default router;
