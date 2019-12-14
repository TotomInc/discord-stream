import { Stream } from '@discord-stream/models';
import { Readable } from 'stream';
import { URL } from 'url';
import Discord from 'discord.js';

/**
 * Default abstract class for any provider/service.
 */
export abstract class ProviderHandler {
  /**
   *
   * @param query an url to resolve or a search query
   * @param message the discord message that initiated this
   */
  public abstract fetchTrack(query: string, message: Discord.Message): Promise<Stream.ITrack[]>;

  /**
   * Map the raw track metadata to a `Track` object.
   * 
   * WARNING: it looks it it's impossible to do a `static abstract` method on
   * an interface currently in TypeScript.
   * 
   * TODO: switch this method into a `static abstract` when possible.
   *
   * @param track raw track metadata
   * @param message the discord message that initiated this
   */
  public abstract mapTrack(track: any, message: Discord.Message): Stream.ITrack;

  /**
   * Returns an URL to resolve or a readable stream.
   *
   * @param track the track object containing metadata
   */
  public abstract getReadableStream(track: Stream.ITrack): string | Readable;

  /**
   * Check if a query is a URL by using the URL module from Node, if it throws an
   * error, the query is not an URL.
   *
   * @param query a query to check if it is a URL
   */
  public isURL(query: string): boolean {
    try {
      new URL(query);
    } catch (error) {
      return false;
    }
  
    return true;
  }
}
