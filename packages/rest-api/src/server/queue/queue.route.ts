import express from 'express';
import validate from 'express-validation';

import * as queueCtrl from './queue.controller';
import * as queueValidators from './queue.validators';

// Ensure the router can access the parent router params
const router = express.Router({
  mergeParams: true,
});

// Endpoint used only to create a queue
router.route('/')
  .get(queueCtrl.getAll)
  .post(validate(queueValidators.create), queueCtrl.create);

// `queueID` CRUD operations
router.route('/:queueID')
  .get(queueCtrl.get)
  .put(validate(queueValidators.update), queueCtrl.update)
  .delete(queueCtrl.remove);

// Load queue into the request when the `queueID` parameter is hit
router.param('queueID', queueCtrl.load);

export default router;
