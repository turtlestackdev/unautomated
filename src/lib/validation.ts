import { type ZodType, z, type ZodEffects, type ZodString } from 'zod';
import { isObject } from '@/lib/type-guards';

export type FormAction<T extends ZodType, M> = (data: FormData) => Promise<FormResponse<T, M>>;
export type FormResponse<T extends ZodType, M> =
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

export function emptyStringToUndefined(arg: unknown): unknown {
  if (arg === '') {
    return undefined;
  }

  return arg;
}

export const emptyStringIsUndefined = z.string().transform((val) => (val === '' ? undefined : val));

type MaybeDate = z.ZodUnion<
  [
    z.ZodEffects<z.ZodString, Date, string>,
    z.ZodOptional<z.ZodEffects<z.ZodString, string | undefined, string>>,
  ]
>;
type RequiredDate = z.ZodPipeline<
  ZodEffects<ZodString, string | undefined, string>,
  ZodEffects<ZodString, Date, string>
>;
export const dateString = (props?: {
  optional?: boolean;
  requiredMessage?: string;
  formatMessage?: string;
  invalidMessage?: string;
}): MaybeDate | RequiredDate => {
  const {
    optional = false,
    requiredMessage = 'date required',
    formatMessage = 'invalid format',
    invalidMessage = 'invalid date',
  } = props ?? {};

  const pattern = z
    .string({ required_error: requiredMessage })
    .regex(/\d{4}-\d{2}-\d{2}/, { message: formatMessage })
    .transform((val, ctx) => {
      const parsed = new Date(`${val}T00:00:00`);
      if (isNaN(parsed.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: invalidMessage,
        });

        return z.NEVER;
      }

      return parsed;
    });

  const maybeDate: MaybeDate = pattern.or(emptyStringIsUndefined.optional());
  const requiredDate: RequiredDate = emptyStringIsUndefined.pipe(pattern);

  return optional ? maybeDate : requiredDate;
};

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

export const deleteSchema = z.object({
  id: emptyStringIsUndefined.pipe(z.string({ required_error: 'id is missing' })),
});

export type DeleteEntityState = FormResponse<typeof deleteSchema, string>;
