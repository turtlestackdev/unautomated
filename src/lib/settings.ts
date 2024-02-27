// todo find a way to split settings into server-safe and edge-safe
//import os from 'os';
//export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? os.tmpdir();

export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? '/tmp';
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'unautomated_auth_session';
export const LOCALHOST = process.env.LOCALHOST ?? 'http://localhost:3000';

if (process.env.DATABASE_URL === undefined) {
  throw new Error('DATABASE_URL not configured');
}
export const DATABASE_URL = process.env.DATABASE_URL;

if (process.env.GITHUB_CLIENT_ID === undefined || process.env.GITHUB_CLIENT_SECRET === undefined) {
  throw new Error('GitHub OAuth credentials not configured');
}
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
