import { Stream, Soundcloud } from '@discord-stream/models';
import Discord from 'discord.js';
import to from 'await-to-js';

import { config } from '@/config';
import { ProviderHandler } from '@/handler';
import SoundcloudAPI from '@api/SoundcloudAPI';

export default class SoundcloudHandler extends ProviderHandler {
  /**
   * Core logic to fetch a single track or search results. Make sure to parse
   * API results as a `Stream.Track` object.
   *
   * @param query an url or a search query
   * @param message the discord message that initiated this
   */
  public async fetchTrack(query: string, message: Discord.Message): Promise<Stream.ITrack[]> {
    const tracks: Stream.ITrack[] = [];
    const isValidURL = this.isURL(query);

    if (isValidURL) {
      const [err, resource] = await to(SoundcloudAPI.resolveURL(query));
  
      if (!err && resource && SoundcloudHandler.isTrack(resource)) {
        const mappedTrack: Stream.ITrack = this.mapTrack(resource, message);

        tracks.push(mappedTrack);
      } else if (!err && resource && SoundcloudHandler.isPlaylist(resource)) {
        resource.tracks
          .map(track => this.mapTrack(track, message))
          .forEach(track => tracks.push(track));
      }
    } else {
      const [err, trackSearchResults] = await to(SoundcloudAPI.searchTrack(query));
  
      if (!err && trackSearchResults) {
        trackSearchResults.slice(0, 3)
          .map(track => this.mapTrack(track, message))
          .forEach(track => tracks.push(track));
      }
    }
  
    return tracks;
  }

  /**
   * Returns a streamable URL that can be turned into a readable stream using
   * `discord.js` and `node-opus`.
   *
   * @param track the track object containing metadata
   */
  public getReadableStream(track: Stream.ITrack): string {
    return `${track.streamURL}?client_id=${config.tokens.soundcloud}`;
  }

  /**
   * Map the track metadata fetched from SoundCloud API to a `Stream.Track`
   * object.
   *
   * @param video metadata of the video fetched from SoundCloud API
   * @param message initiator of the track
   */
  public mapTrack(track: Soundcloud.Track, message: Discord.Message): Stream.ITrack {
    return {
      provider: 'soundcloud',
      url: track.permalink_url,
      streamURL: track.stream_url,
      title: track.title,
      description: track.description,
      views: track.playback_count.toString(),
      thumbnailURL: track.artwork_url,
      duration: (track.duration / 1000).toString(),
      initiator: message,
    };
  }

  /**
   * Custom type-guard to detect if the resource is of kind `track`.
   *
   * @param resource kind of the resource
   */
  private static isTrack(resource: Soundcloud.Response): resource is Soundcloud.Track {
    return resource.kind === 'track';
  }

  /**
   * Custom type-guard to detect if the resource is of kind `playlist`.
   *
   * @param resource kind of the resource
   */
  private static isPlaylist(resource: Soundcloud.Response): resource is Soundcloud.Playlist {
    return resource.kind === 'playlist';
  }

  /**
   * Custom type-guard to detect if the resource is of kind `user`.
   *
   * @param resource kind of the resource
   */
  private static isUser(resource: Soundcloud.Response): resource is Soundcloud.User {
    return resource.kind === 'user';
  }
}
