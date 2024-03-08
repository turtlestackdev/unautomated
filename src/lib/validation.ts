import type { ZodType } from 'zod';
import { z } from 'zod';
import { isObject, isString } from '@/lib/type-guards';

export type FormState<T extends ZodType, M> =
  | { status: 'new'; errors?: never; model?: never }
  | {
      status: 'success';
      errors?: never;
      model: M;
    }
  | {
      status: 'error';
      errors: z.inferFlattenedErrors<T>;
      model?: never;
    };

export const initialFormState = { status: 'new' } as const;

export function emptyStringToUndefined(arg: unknown): unknown {
  if (isString(arg) && arg === '') {
    return undefined;
  }
  return arg;
}

export const optionalDateString = z
  .string()
  .regex(/^$|\d{4}-\d{2}-\d{2}/, { message: 'invalid format' })
  .optional()
  .transform((val, ctx) => {
    if (val) {
      const parsed = new Date(`${val}T00:00:00`);
      if (isNaN(parsed.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid date',
        });

        return z.NEVER;
      }

      return parsed;
    }
    return undefined;
  });

export function parseFieldName(field: string):
  | { name: string; type: 'single' | 'array'; key?: never }
  | {
      name: string;
      type: 'object';
      key: string;
    } {
  const ptn = /^(?<field>[^[]+)(?:\[(?<key>[^\]]*)])?$/;
  const parsed = ptn.exec(field);
  if (parsed?.[1] === undefined) {
    return { name: field, type: 'single' };
  }

  const name = parsed[1];
  const key = parsed[2];

  if (key === undefined) {
    return { name, type: 'single' };
  }

  if (Number.isInteger(Number(key.trim()))) {
    return { name, type: 'array' };
  }

  return { name, type: 'object', key: key.trim() };
}

export function formToObject(
  form: FormData
): Record<string, FormDataEntryValue | FormDataEntryValue[] | Record<string, FormDataEntryValue>> {
  const data: Record<
    string,
    FormDataEntryValue | FormDataEntryValue[] | Record<string, FormDataEntryValue>
  > = {};
  for (const entry of form.entries()) {
    const field = parseFieldName(entry[0]);
    switch (field.type) {
      case 'single': {
        data[field.name] = entry[1];
        break;
      }
      case 'array': {
        const fieldData = data[field.name];
        if (Array.isArray(fieldData)) {
          data[field.name] = [...fieldData, entry[1]];
        } else {
          data[field.name] = [entry[1]];
        }

        break;
      }

      case 'object': {
        const fieldData = data[field.name];
        if (isObject(fieldData)) {
          data[field.name] = { ...fieldData, [field.key]: entry[1] };
        } else {
          data[field.name] = { [field.key]: entry[1] };
        }
        break;
      }
    }
  }

  return data;
}
