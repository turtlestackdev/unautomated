import { db } from '@/database/client';
import { fileTypeFromBlob } from 'file-type';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { UPLOAD_DIR } from '@/settings';
import imageSize from 'image-size';
import type { Selectable, Transaction } from 'kysely';
import type { DB, FileUpload } from '@/database/schema';
import { FileFormatError, FileSizeError } from '@/errors';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'] as const;
const maxFileSize = 10 * 1024 ** 2;

export type ImageType = (typeof allowedImageTypes)[number];

export function isImageType(type: string): type is ImageType {
  // The as const on allowedImageTypes makes the includes check useless without widening the type.
  // This type guard is created so that widening doesn't need to be repeated.
  return (allowedImageTypes as ReadonlyArray<string>).includes(type);
}

export async function getFileDetails(file: File) {
  let type = 'unknown';
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

export async function read(id: string) {
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
  return await qb
    .insertInto('file_uploads')
    .values({
      id: id,
      ...details,
      name: file.name,
      description: description,
      path: path,
      uploaded_by_id: userID,
      height: height,
      width: width,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
