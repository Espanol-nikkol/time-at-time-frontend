import js from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import tsParser from '@typescript-eslint/parser';
import tsEsPrettier from 'eslint-plugin-prettier';
import esReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['node_modules', 'build'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tsParser,
            parserOptions: {
                sourceType: 'module',
                project: './tsconfig.app.json',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier: tsEsPrettier,
            react: esReact,
            '@stylistic/ts': stylisticTs,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            'import/order': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@stylistic/ts/padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: ['block-like', 'if'] },
            ],
            'object-shorthand': ['error', 'always', { avoidQuotes: true }],
            'arrow-body-style': ['error', 'as-needed'],
            'no-unused-vars': ['off'],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
    {
        files: ['vite.config.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
            },
        },
    }
);
