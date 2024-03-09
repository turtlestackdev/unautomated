import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileTypeFromBlob } from 'file-type';
import { imageSize } from 'image-size';
import type { Selectable, Transaction } from 'kysely';
import type { ZodType } from 'zod';
import { z } from 'zod';
import { UPLOAD_DIR } from '@/lib/settings';
import { db } from '@/database/client';
import type { DB, FileUpload } from '@/database/schema';
import { FileFormatError, FileSizeError } from '@/lib/errors';

export type ImageType = (typeof allowedFileTypes.image)[number];

export function isImageType(type: string): type is ImageType {
  // The as const on allowedFileTypes.image makes the includes check useless without widening the type.
  // This type guard is created so that widening doesn't need to be repeated.
  return (allowedFileTypes.image as readonly string[]).includes(type);
}

const allowedFileTypes = {
  image: ['image/jpeg', 'image/png', 'image/gif'],
  document: ['application/pdf'],
} as const;
const maxMegabytes = 10;
const maxFileSize = maxMegabytes * 1024 ** 2;

export type FileType = 'unknown' | 'image';

type AllowedMime = (typeof allowedFileTypes)[keyof typeof allowedFileTypes][number];

export interface ValidatorProps {
  type?: keyof typeof allowedFileTypes;
  mimeType?: AllowedMime[] | AllowedMime;
  required?: boolean;
  fieldName?: string;
}

function checkFileTypes(allowed: readonly string[]) {
  return async (file: File) => {
    const fileType = await fileTypeFromBlob(file);
    return fileType && allowed.includes(fileType.mime);
  };
}

export function validator({
  type,
  mimeType,
  required = false,
  fieldName = 'File',
}: ValidatorProps): ZodType<File> | ZodType<File | undefined> {
  let allowedTypes = type
    ? allowedFileTypes[type]
    : Object.entries(allowedFileTypes).flatMap((types) => types[1]);

  if (mimeType) {
    const filter = Array.isArray(mimeType) ? mimeType : [mimeType];
    allowedTypes = allowedTypes.filter((fileType) => filter.includes(fileType));
  }

  const validateType = checkFileTypes(allowedTypes);

  if (!required) {
    return z
      .instanceof(File)
      .optional()
      .refine((file) => file && file.size < maxFileSize, `Max file size is ${maxMegabytes}MB.`)
      .refine((file) => {
        return !file || validateType(file);
      }, `Invalid file type`);
  }
  return z
    .instanceof(File, { message: `${fieldName} is required` })
    .superRefine((file, ctx) => {
      if (file.size === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} is required`,
          fatal: true,
        });

        return z.NEVER;
      }
    })
    .refine((file) => file.size < maxFileSize, `Max file size is ${maxMegabytes}MB.`)
    .refine(validateType, `Invalid file type`);
}

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
