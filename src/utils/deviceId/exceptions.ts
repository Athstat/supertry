export class DeviceIdUnavailableError extends Error {
  constructor(message = 'Unable to obtain mobile device ID') {
    super(message);
    this.name = 'DeviceIdUnavailableError';
  }
}
