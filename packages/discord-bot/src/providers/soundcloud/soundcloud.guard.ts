import * as models from '../../models';

export function isTrack(resource: models.SoundcloudResponse): resource is models.SoundcloudTrack {
  return resource.kind === 'track';
}

export function isUser(resource: models.SoundcloudResponse): resource is models.SoundcloudUser {
  return resource.kind === 'user';
}

export function isPlaylist(resource: models.SoundcloudResponse): resource is models.SoundcloudPlaylist {
  return resource.kind === 'playlist';
}
