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

export interface YoutubeSearchListResponse {
  kind: 'youtube#searchListResponse';
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeSearchResult[];
}

export interface YoutubeSearchResult {
  kind: 'youtube#searchResult';
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: any;
}
