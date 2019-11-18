/**
 * Namespace for all things related to the `discord` rest-api data.
 */
export namespace DiscordAPI {
  export interface DiscordUserTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  }
}
