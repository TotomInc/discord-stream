import { connection } from '../connection';
import * as models from '../models';

const dbName = 'discord-stream';

/**
 * Return all prefixes stored in the DB.
 */
export async function getPrefixes() {
  const client = await connection();
  const collection = client.db(dbName).collection<models.CustomPrefix>('prefixes');

  return await collection.find();
}

/**
 * Return the prefix of a specific guild if it exists.
 *
 * @param guildID the id of the discord guild
 */
export async function getPrefix(guildID: string) {
  const client = await connection();
  const collection = client.db(dbName).collection<models.CustomPrefix>('prefixes');
  const query = { guildID };

  return await collection.findOne(query);
}
