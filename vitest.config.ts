import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['tests/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**', '.tmp/**'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
                "src/vite-env.d.ts"
            ],
		},
	},
});
