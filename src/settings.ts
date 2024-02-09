// todo find a way to split settings into server-safe and edge-safe
//import os from 'os';
//export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? os.tmpdir();
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? '/tmp';
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'unautomated_auth_session';
export const LOCALHOST = process.env.LOCALHOST ?? 'http://localhost:3000';
