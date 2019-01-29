import { Readable } from 'stream';

export interface StreamProvider {
  stream?: Readable;
  arbitraryURL?: string;
}
