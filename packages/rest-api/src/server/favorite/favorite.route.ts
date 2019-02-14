import express from 'express';
import validate from 'express-validation';

import * as favoriteCtrl from './favorite.controller';
import * as favoriteValidators from './favorite.validators';

// Ensure the favorite-router can access the parent router params
const router = express.Router({
  mergeParams: true,
});

// Endpoint used only to create a favorite
router.route('/')
  .post(validate(favoriteValidators.create), favoriteCtrl.create);

// `favoriteID` CRUD operations
router.route('/:favoriteID')
  .get(favoriteCtrl.get)
  .put(validate(favoriteValidators.update), favoriteCtrl.update)
  .delete(favoriteCtrl.remove);

// Load favorite into the request when the `favoriteID` parameter is hit
router.param('favoriteID', favoriteCtrl.load);

export default router;
