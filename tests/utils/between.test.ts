import { describe, it, expect } from 'vitest';
import { between } from '../../src/utils/between';

describe('between', () => {
	it('returns a value within [min, max)', () => {
		for (let i = 0; i < 100; i++) {
			const v = between(2, 5);
			expect(v).toBeGreaterThanOrEqual(2);
			expect(v).toBeLessThan(5);
		}
	});

	it('handles negative ranges', () => {
		for (let i = 0; i < 50; i++) {
			const v = between(-10, -1);
			expect(v).toBeGreaterThanOrEqual(-10);
			expect(v).toBeLessThan(-1);
		}
	});

	it('returns min when min === max', () => {
		expect(between(7, 7)).toBe(7);
	});
});
