import express from 'express';
import validate from 'express-validation';

import * as guildCtrl from './guild.controller';
import * as guildValidators from './guild.validators';

const router = express.Router();

// Endpoint used only to create a guild
router.route('/')
  .post(validate(guildValidators.create), guildCtrl.create);

// `guildID` CRUD operations
router.route('/:guildID')
  .get(guildCtrl.get)
  .put(validate(guildValidators.update), guildCtrl.update)
  .delete(guildCtrl.remove);

// CRUD operations for guild custom-prefix
router.route('/:guildID/prefix')
  .put(validate(guildValidators.updatePrefix), guildCtrl.updatePrefix)
  .delete(guildCtrl.removePrefix);

// Load guild into the request when the `guildID` parameter is hit
router.param('guildID', guildCtrl.load);

export default router;
