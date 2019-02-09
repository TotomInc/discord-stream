import express from 'express';
import validate from 'express-validation';

import validators from '../../config/parameter-validation';
import * as userCtrl from './user.controller';

const router = express.Router();

// Endpoint used only to create a user
router.route('/').post(validate(validators.newUser), userCtrl.create);

// `userID` CRUD operations
router.route('/:userID').get(userCtrl.get);

// Load user into the request when the `userID` parameter is hit
router.param('userID', userCtrl.load);

export default router;
