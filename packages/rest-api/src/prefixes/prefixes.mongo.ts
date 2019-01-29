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

/**
 * Insert a new entry prefix document into the collection.
 *
 * @param guildID the id of the discord guild
 * @param prefix the custom-prefix for this guild
 */
export async function insertPrefix(guildID: string, prefix: string) {
  const client = await connection();
  const collection = client.db(dbName).collection<models.CustomPrefix>('prefixes');
  const query = { guildID, prefix };
  console.log('inserting prefix', guildID, prefix);
  return await collection.insertOne(query);
}

/**
 * Replace the prefix of a guild.
 *
 * @param guildID the id of the discord guild
 * @param prefix the new custom-prefix for this guild
 */
export async function replacePrefix(guildID: string, prefix: string) {
  const client = await connection();
  const collection = client.db(dbName).collection<models.CustomPrefix>('prefixes');
  const filterQuery = { guildID };
  const query = { guildID, prefix };

  return await collection.replaceOne(filterQuery, query);
}

/**
 * Delete the prefix document of a guild.
 *
 * @param guildID the id of the discord guild
 */
export async function deletePrefix(guildID: string) {
  const client = await connection();
  const collection = client.db(dbName).collection<models.CustomPrefix>('prefixes');
  const filterQuery = { guildID };

  return await collection.deleteOne(filterQuery);
}
