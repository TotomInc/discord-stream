import { Readable } from 'stream';

/**
 * All things related to music-streaming from a third-party service.
 */
export namespace StreamProviders {
  /** List of supported providers */
  export type providers = 'youtube' | 'soundcloud';

  export interface StreamableTrackData {
    stream?: Readable;
    arbitraryURL?: string;
  }
}
