export interface Guild {
  guildID: string;
  name: string;
  iconURL?: string;
  ownerID: string;
  region: string;
  customPrefix?: string;
}

export interface GuildPrefix {
  [guildID: string]: string;
}
