import os from 'os';

export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? os.tmpdir();
