const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

const vercelStyles = [
  '@vercel/style-guide/eslint/browser',
  //'@vercel/style-guide/eslint/node',
  '@vercel/style-guide/eslint/typescript',
  '@vercel/style-guide/eslint/react',
  '@vercel/style-guide/eslint/next',

].map(require.resolve);

module.exports = {
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    ...vercelStyles,
    'next/core-web-vitals',
    'prettier',
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  // add rules configurations here
  rules: {
    'curly': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-console': 'off',
  },
  overrides: [
    // Next.js needs default exports for pages and layouts.
    {
      files: ['src/app/**/*/page.tsx', 'src/app/**/*/layout.tsx', 'next.config.mjs', 'tailwind.config.ts'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': ['error', { target: 'any' }],
      },
    },
  ],
};
