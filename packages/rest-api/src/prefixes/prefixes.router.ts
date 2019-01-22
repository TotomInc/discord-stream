import Express from 'express';

import * as MongoPrefixes from './prefixes.mongo';

const routes = Express.Router();

routes.get('/', async (req, res) => {
  const prefixes = await MongoPrefixes.getPrefixes();
  const prefixesArray = await prefixes.toArray();

  res.status(200).json(prefixesArray);
});

routes.get('/:guildID', async (req, res) => {
  const guildID = req.params['guildID'] as (string | undefined);

  if (!guildID) {
    return res.status(400).end();
  }

  const prefix = await MongoPrefixes.getPrefix(guildID);

  if (!prefix) {
    return res.status(400).end();
  }

  res.status(200).json(prefix);
});

routes.put('/:guildID', async (req, res) => {
  const guildID = req.params['guildID'] as (string | undefined);
  const prefix = req.query['prefix'] as (string | undefined);

  if (!guildID || !prefix) {
    return res.status(400).end();
  }

  const prefixExists = await MongoPrefixes.getPrefix(guildID);
  const response = (!prefixExists)
    ? await MongoPrefixes.insertPrefix(guildID, prefix)
    : await MongoPrefixes.replacePrefix(guildID, prefix);

  if (!response.result.ok) {
    return res.status(500).end();
  }

  const insertedPrefix = await MongoPrefixes.getPrefix(guildID);

  return res.status(200).json(insertedPrefix);
});

routes.delete('/:guildID', async (req, res) => {
  const guildID = req.params['guildID'] as (string | undefined);

  if (!guildID) {
    return res.status(400).end();
  }

  const response = await MongoPrefixes.deletePrefix(guildID);

  if (!response.result.ok) {
    return res.status(500).end();
  }

  return res.status(200).end();
});

export default routes;
