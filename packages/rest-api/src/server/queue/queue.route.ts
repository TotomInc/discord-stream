import express from 'express';
import validate from 'express-validation';

import * as queueCtrl from './queue.controller';
import * as queueValidators from './queue.validators';

// Ensure the router can access the parent router params
const router = express.Router({
  mergeParams: true,
});

// Not able to create new queues since this is already done in the creation of
// a guild, only get a list of all queues
router.route('/')
  .get(queueCtrl.getAll);

// `queueID` CRUD operations, cannot remove a queue since it's automatically
// deleted when a guild is deleted
router.route('/:queueID')
  .get(queueCtrl.get)
  .put(validate(queueValidators.update), queueCtrl.update);

// Load queue into the request when the `queueID` parameter is hit
router.param('queueID', queueCtrl.load);

export default router;
