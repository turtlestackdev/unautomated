import { expect, test } from 'vitest';
import * as validation from '@/lib/validation';

test('field names are parsed correctly', () => {
  expect(validation.parseFieldName('name')).toEqual({ name: 'name', type: 'single' });
  expect(validation.parseFieldName('name[]')).toEqual({ name: 'name', type: 'array' });
  expect(validation.parseFieldName('name[2]')).toEqual({ name: 'name', type: 'array' });
  expect(validation.parseFieldName('name[cat]')).toEqual({
    name: 'name',
    type: 'object',
    key: 'cat',
  });
});

test('form data is correctly converted to objects', () => {
  const tests: {
    data: [string, string][];
    expected: Record<
      string,
      FormDataEntryValue | FormDataEntryValue[] | Record<string, FormDataEntryValue>
    >;
  }[] = [
    {
      data: [
        ['name', 'happy'],
        ['description', 'some stuff'],
      ],
      expected: { name: 'happy', description: 'some stuff' },
    },
    {
      data: [
        ['name', 'more'],
        ['list[]', 'first'],
        ['list[]', 'second'],
        ['obj[a]', 'Alpha'],
        ['obj[b]', 'Beta'],
      ],
      expected: {
        name: 'more',
        list: ['first', 'second'],
        obj: { a: 'Alpha', b: 'Beta' },
      },
    },
  ];

  tests.forEach(({ data, expected }) => {
    const form = new FormData();
    data.forEach(([field, value]) => {
      form.append(field, value);
    });

    expect(validation.formToObject(form)).toEqual(expected);
  });
});
