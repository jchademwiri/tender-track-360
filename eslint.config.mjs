import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import noUnescapedAutofix from './eslint-rules/no-unescaped-autofix.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    rules: {
      'prefer-arrow-callback': ['error'],
      'prefer-template': ['error'],
      // disable the default (non-fixable) rule
      'react/no-unescaped-entities': 'off',
    },
  }),
  // Add the custom plugin as a separate flat config object
  {
    plugins: {
      local: {
        rules: {
          'no-unescaped-autofix': noUnescapedAutofix,
        },
      },
    },
    rules: {
      // enable our custom fixable rule
      'local/no-unescaped-autofix': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
