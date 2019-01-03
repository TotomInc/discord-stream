import { URL } from 'url';
import YTDL from 'ytdl-core';

export function isVideo(url: string): boolean {
  return YTDL.validateURL(url);
}

export function isPlaylist(url: string): boolean {
  return new URL(url).searchParams.has('list');
}
