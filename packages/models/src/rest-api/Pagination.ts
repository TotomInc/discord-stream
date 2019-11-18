/**
 * Namespace for all things related to the `pagination` rest-api data.
 */
export namespace PaginationAPI {
  /**
   * Pagination data to send to the API as URL query parameters.
   */
  export interface IPagination {
    limit?: number;
    skip?: number;
    max?: boolean;
  }
}
