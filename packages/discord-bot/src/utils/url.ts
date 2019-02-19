import { URL } from 'url';

/**
 * Check if a query is a URL by using the URL module from Node, if it throws an
 * error, the query is not an URL.
 *
 * @param query a query to check if it is a URL
 */
export function isURL(query: string) {
  try {
    new URL(query);
  } catch (error) {
    return false;
  }

  return true;
}
