import express from 'express';
import validate from 'express-validation';

import * as userCtrl from './user.controller';
import * as userValidators from './user.validators';

const router = express.Router();

// Endpoint used only to create a user
router.route('/')
  .post(validate(userValidators.create), userCtrl.create);

// `userID` CRUD operations
router.route('/:userID')
  .get(userCtrl.get)
  .put(validate(userValidators.update), userCtrl.update)
  .delete(userCtrl.remove);

// Load user into the request when the `userID` parameter is hit
router.param('userID', userCtrl.load);

export default router;
