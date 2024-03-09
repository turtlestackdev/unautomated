import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileTypeFromBlob } from 'file-type';
import { imageSize } from 'image-size';
import type { Selectable, Transaction } from 'kysely';
import { UPLOAD_DIR } from '@/lib/settings';
import { db } from '@/database/client';
import type { DB, FileUpload } from '@/database/schema';
import { FileFormatError, FileSizeError } from '@/lib/errors';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'] as const;
const maxFileSize = 10 * 1024 ** 2;

export type ImageType = (typeof allowedImageTypes)[number];

export function isImageType(type: string): type is ImageType {
  // The as const on allowedImageTypes makes the includes check useless without widening the type.
  // This type guard is created so that widening doesn't need to be repeated.
  return (allowedImageTypes as readonly string[]).includes(type);
}

export type FileType = 'unknown' | 'image';

export async function getFileDetails(file: File): Promise<
  | {
      ext: string;
      mime_type: string;
      type: FileType;
      size: number;
      name: string;
    }
  | undefined
> {
  let type: FileType = 'unknown';
  const fileType = await fileTypeFromBlob(file);
  if (!fileType) {
    return undefined;
  }

  if (isImageType(fileType.mime)) {
    type = 'image';
  }

  return {
    ext: fileType.ext,
    mime_type: fileType.mime,
    type,
    size: file.size,
    name: file.name,
  };
}

export async function read(id: string): Promise<Selectable<FileUpload>> {
  return db.selectFrom('file_uploads').selectAll().where('id', '=', id).executeTakeFirstOrThrow();
}

export async function uploadImage(
  file: File,
  userID: string,
  description: string,
  trx?: Transaction<DB>
): Promise<Selectable<FileUpload>> {
  if (file.size > maxFileSize) {
    throw new FileSizeError('file exceeds max size');
  }

  const details = await getFileDetails(file);
  if (!details || details.type !== 'image') {
    throw new FileFormatError('unsupported file format');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const id = crypto.randomUUID();
  const path = join(UPLOAD_DIR, `${id}.${details.ext}`);
  await writeFile(path, buffer);
  const { height, width } = imageSize(path);

  const qb = trx ? trx : db;
  return qb
    .insertInto('file_uploads')
    .values({
      id,
      ...details,
      name: file.name,
      description,
      path,
      uploaded_by_id: userID,
      height,
      width,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
