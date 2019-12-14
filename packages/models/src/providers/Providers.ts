import { Readable } from 'stream';

/**
 * All things related to music-streaming from a third-party service.
 */
export namespace StreamProviders {
  export type IYouTubeProvider = 'youtube';
  export type ISoundCloudProvider = 'soundcloud';

  /** List of supported providers/services */
  export type IProviders = IYouTubeProvider | ISoundCloudProvider;

  export interface IStreamableTrackData {
    stream?: Readable;
    arbitraryURL?: string;
  }
}
