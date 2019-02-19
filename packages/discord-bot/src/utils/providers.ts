import { providers as Providers } from '../models/providers';

/**
 * A list of supported providers.
 */
export const providers: Providers[] = ['youtube', 'soundcloud'];

/**
 * Determinate the video/sound provider of a URL based on the `Providers`
 * constant.
 *
 * @param url an URL to a video or sound service
 */
export function detectURLProvider(url: string): Providers | undefined {
  return providers.find(provider => url.indexOf(provider) > -1);
}

/**
 * Return a list of supported providers.
 */
export function providersList(): string[] {
  return providers;
}
