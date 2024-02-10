export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}
