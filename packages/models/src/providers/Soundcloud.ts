/**
 * Soundcloud API responses.
 */
export namespace Soundcloud {
  export interface Response {
    kind: string;
  }

  export interface Track {
    kind: 'track';
    id: number;
    created_at: string;
    user_id: number;
    duration: number;
    commentable: boolean;
    last_modified: string;
    sharing: string;
    tag_list: string;
    permalink: string;
    streamable: boolean;
    genre: string;
    title: string;
    description: string;
    uri: string;
    permalink_url: string;
    artwork_url: string;
    stream_url: string;
    download_url: string;
    playback_count: number;
    favoritings_count: number;
    reposts_count: number;
    comment_count: number;
    attachments_uri: string;
    user: UserPeek;
  }

  export interface Playlist {
    duration: number;
    permalink_url: string;
    reposts_count: number;
    description: string;
    uri: string;
    tag_list: string;
    track_count: number;
    user_id: number;
    tracks: Track[];
  }

  export interface UserPeek {
    id: number;
    kind: 'user';
    username: string;
    uri: string;
    permalink_url: string;
    avatar_url: string;
  }

  export interface User {
    id: number;
    kind: 'user';
    username: string;
    uri: string;
    permalink_url: string;
    avatar_url: string;
    country: string;
    first_name: string;
    last_name: string;
    full_name: string;
    description: string;
    city: string;
    website: string;
    track_count: number;
    playlist_count: number;
    public_favorites_count: number;
    followers_count: number;
    followings_count: number;
    reposts_count: number;
  }

  export interface Playlist {
    duration: number;
    release_day: number;
    permalink_url: string;
    reposts_count: number;
    genre: string;
    permalink: string;
    purchase_url: string;
    release_month: number;
    description: string;
    uri: string;
    label_name: string;
    tag_list: string;
    release_year: number;
    track_count: number;
    user_id: number;
    last_modified: string;
    license: string;
    tracks: Track[];
    id: number;
    downloadable: boolean;
    sharing: string;
    created_at: string;
    likes_count: number;
    kind: 'playlist';
    title: string;
    purchase_title: string;
    artwork_url: string;
    streamable: boolean;
    user: UserPeek;
    embeddable_by: string;
  }

  export interface Error {
    errors: [{
      error_message: string;
    }];
  }
}
