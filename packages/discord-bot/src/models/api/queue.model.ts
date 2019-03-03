export interface QueueTrack {
  provider: string;
  url: string;
  title: string;
  description: string;
  views: string;
  thumbnailURL: string;
  duration: string;
  initiator: string;
}

export interface Queue {
  guildID: string;
  tracks: QueueTrack[];
}
