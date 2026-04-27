import { describe, it, expect } from 'vitest';
import { world } from '../src/world';
import { Time, SpatialHashMap } from '../src/traits';

describe('world', () => {
	it('exports a singleton world with Time and SpatialHashMap resources', () => {
		expect(world.get(Time)).toBeDefined();
		expect(world.get(SpatialHashMap)).toBeDefined();
	});
});
