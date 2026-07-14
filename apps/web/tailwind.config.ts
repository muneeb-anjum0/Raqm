import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				raqm: {
					background: '#F4F6F8',
					secondary: '#1B3A5C',
					text: '#1E2A35',
					border: '#D8DEE6',
					muted: '#5F6B76',
					success: '#26734D',
					warning: '#9A6700',
					danger: '#A33A3A'
				}
			}
		}
	}
} satisfies Config;
