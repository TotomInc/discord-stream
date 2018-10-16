export interface YoutubePlaylistItems {
  kind: 'youtube#playlistItemListResponse';
  etag: string;
  items: YoutubePlaylistItem[];
  pageInfo: {
    totalResults: number,
    resultsPerPage: number;
  };
}

export interface YoutubePlaylistItem {
  kind: 'youtube#playlistItem';
  etag: string;
  id: string;
  snippet: {
    resourceId: {
      kind: 'youtube#video';
      videoId: string;
    };
  };
}
