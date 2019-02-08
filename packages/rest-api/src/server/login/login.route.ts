import express from 'express';
import validate from 'express-validation';

import validators from '../../config/parameter-validation';
import * as loginCtrl from './login.controller';

const router = express.Router();

// Accessible from login, redirect to Discord OAuth authorization page.
router.route('/').get(loginCtrl.oauth);

// Redirected from `/`, handle the Discord OAuth code.
router.route('/callback').get(validate(validators.oauthCallback), loginCtrl.oauthCallback);

export default router;
