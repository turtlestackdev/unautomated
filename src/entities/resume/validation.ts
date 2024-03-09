import { z } from 'zod';
import { validator } from '@/entities/file-upload';

export const uploadResumeSchema = z.object({
  file: validator({ mimeType: 'application/pdf', required: true, fieldName: 'Resume' }),
});
