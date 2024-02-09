import * as files from '@/models/file-upload';
import { validateRequest } from '@/auth';
import { NextResponse } from 'next/server';
import fs from 'fs';
import type { ReadableOptions } from 'stream';
import path from 'path';

function streamFile(path: string, options?: ReadableOptions): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      downloadStream.on('end', () => controller.close());
      downloadStream.on('error', (error: NodeJS.ErrnoException) => controller.error(error));
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

export async function GET(request: Request, { params }: { params: { uploadId: string } }) {
  const { session } = await validateRequest();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  const uploadId = params.uploadId;
  const file = await files.read(uploadId);
  if (!file) {
    return new Response(null, { status: 404 });
  }

  const data: ReadableStream<Uint8Array> = streamFile(file.path); //Stream the file with a 1kb chunk
  const headers: HeadersInit = {
    'content-type': file.mime_type,
    'content-length': `${file.size}`,
  };

  if (file.type !== 'image') {
    // We will serve up images directly. Other file types will need to be downloaded.
    headers['content-disposition'] = `attachment; filename=${path.basename(file.path)}`;
  }

  return new NextResponse(data, {
    status: 200,
    headers: new Headers({
      //'content-disposition': `attachment; filename=${path.basename(file.path)}`,
      'content-type': file.mime_type,
      'content-length': file.size + '',
    }),
  });
}
