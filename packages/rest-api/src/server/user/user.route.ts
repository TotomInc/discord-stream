import express from 'express';
import validate from 'express-validation';

import * as userCtrl from './user.controller';
import * as userValidators from './user.validators';

const router = express.Router();

// Load user into the request when the `userID` parameter is hit
router.param('userID', userCtrl.load);

// Endpoint used to get a list of all users or to create a user
router.route('/')
  .get(userCtrl.getAll)
  .post(validate(userValidators.create), userCtrl.create);

// CRUD operations for a specific user
router.route('/:userID')
  .get(userCtrl.get)
  .put(validate(userValidators.update), userCtrl.update)
  .delete(userCtrl.remove);

// Add a route to create massive amount of fake users when not in production
if (process.env.NODE_ENV !== 'production') {
  router.route('/fake').post(userCtrl.createFake);
}

export default router;
