/**
 * Pagination data to send to the API as URL query parameters.
 */
export interface IPagination {
  limit?: number;
  skip?: number;
  max?: boolean;
}
