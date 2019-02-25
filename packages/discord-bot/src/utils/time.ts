import Moment from 'moment';

/**
 * Format seconds to hh:mm:ss using `Moment`.
 *
 * @param seconds number of seconds
 */
export function secondsToHHMMSS(seconds: number | string): string {
  const val = (typeof seconds === 'string')
    ? parseInt(seconds, 10)
    : seconds;

  const formatType = (val >= 3600)
    ? 'HH:mm:ss'
    : 'mm:ss';

  return Moment()
    .utc(false)
    .set({ hour: 0, minute: 0, second: val, millisecond: 0 })
    .format(formatType);
}
