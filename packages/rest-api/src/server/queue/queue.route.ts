import express from 'express';
import validate from 'express-validation';

import * as queueCtrl from './queue.controller';
import * as queueValidators from './queue.validators';

// Ensure the router can access the parent router params
const router = express.Router({
  mergeParams: true,
});

// Create and get all existing queues
router.route('/')
  .get(queueCtrl.getAll)
  .post(queueCtrl.create);

// `queueID` CRUD operations, cannot remove a queue since it's automatically
// deleted when a guild is deleted
router.route('/:queueID')
  .get(queueCtrl.get)
  .put(validate(queueValidators.update), queueCtrl.update);

// Load queue into the request when the `queueID` parameter is hit
router.param('queueID', queueCtrl.load);

export default router;
