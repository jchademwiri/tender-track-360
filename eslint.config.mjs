import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import noUnescapedAutofix from './no-unescaped-autofix.js';

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
      // temporarily disable our custom fixable rule to test core build issues
      // 'local/no-unescaped-autofix': 'error',
    },
  },
  // Test file overrides
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      'react/display-name': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'local/no-unescaped-autofix': 'off',
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
