export class FileFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileFormatError';
  }
}

export class FileSizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileSizeError';
  }
}
