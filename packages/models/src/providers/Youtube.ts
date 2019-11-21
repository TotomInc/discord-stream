/**
 * Youtube API responses.
 */
export namespace Youtube {
  export interface PlaylistItems {
    kind: 'youtube#playlistItemListResponse';
    etag: string;
    items: PlaylistItem[];
    pageInfo: {
      totalResults: number,
      resultsPerPage: number;
    };
  }

  export interface PlaylistItem {
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

  export interface SearchListResponse {
    kind: 'youtube#searchListResponse';
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    regionCode: string;
    pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };
    items: SearchResult[];
  }

  export interface SearchResult {
    kind: 'youtube#searchResult';
    etag: string;
    id: {
      kind: string;
      videoId: string;
    };
    snippet: any;
  }
}
