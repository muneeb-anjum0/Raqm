import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**', 'playwright-report/**', 'test-results/**']
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {}
		}
	},
	{
		rules: {
			'svelte/no-at-html-tags': 'error',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/require-each-key': 'off',
			'no-undef': 'off'
		}
	}
];
