import http from '../http';

import { Guild, GuildPrefix } from '../models/api/guild.model';

export class GuildService {
  public create(guild: Guild) {
    return http.post<Guild>('guilds', guild);
  }

  public get(guildID: string) {
    return http.get<Guild>(`guilds/${guildID}`);
  }

  public getAll() {
    return http.get<{ [guildID: string]: Guild }>('guilds');
  }

  public getAllPrefixes() {
    return http.get<GuildPrefix>('guilds/prefixes');
  }

  public update(guild: Guild) {
    return http.put<Guild>(`guilds/${guild.guildID}`, guild) ;
  }

  public updatePrefix(guildID: string, data: { customPrefix: string }) {
    return http.put<Guild>(`guilds/${guildID}/prefix`, data);
  }

  public delete(guildID: string) {
    return http.delete<Guild>(`guilds/${guildID}`);
  }

  public deletePrefix(guildID: string) {
    return http.delete<Guild>(`guilds/${guildID}/prefix`);
  }
}
