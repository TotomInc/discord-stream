import * as bluebird from 'bluebird';

declare module 'mongoose' {
  type Promise<T> = bluebird<T>;
}
