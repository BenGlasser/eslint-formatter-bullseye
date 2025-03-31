import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
	{
		ignores: [
			'dist/**',
			'node_modules/**',
			'build/**',
			'coverage/**',
			'public/**',
			'*.d.ts',
		],
	},
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: [
			'*.config.js',
			'*.config.ts',
			'webpack.config.js',
			'vitest.config.js',
			'vitest.config.ts',
		],
		languageOptions: {
			globals: {
				process: true,
			},
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest',
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: true,
			noInlineConfig: false,
		},
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			'prettier/prettier': 'error',
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'no-console': 'warn',
			'no-control-regex': 'off',
		},
	},
];
