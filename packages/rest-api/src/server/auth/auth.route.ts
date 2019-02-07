import express from 'express';
import validate from 'express-validation';

import validators from '../../config/parameter-validation';
import * as authCtrl from './auth.controller';

const router = express.Router();

/**
 * Default endpoint is used to authenticate third-party tools.
 */
router.route('/').post(validate(validators.auth), authCtrl.authenticate);

export default router;
