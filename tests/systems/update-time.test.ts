import { describe, it, expect } from 'vitest';
import { createWorld } from 'koota';
import { Time } from '../../src/traits';
import { updateTime } from '../../src/systems/update-time';

describe('updateTime', () => {
	it('initializes time.current on first call and produces a tiny delta', () => {
		const world = createWorld(Time);
		updateTime(world);
		const t = world.get(Time)!;
		expect(t.delta).toBeGreaterThanOrEqual(0);
		expect(t.delta).toBeLessThan(1 / 30 + 1e-6);
		expect(t.current).toBeGreaterThan(0);
	});

	it('caps delta at 1/30 even after a long pause', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0, current: performance.now() - 5000 });
		updateTime(world);
		const t = world.get(Time)!;
		expect(t.delta).toBeCloseTo(1 / 30, 5);
	});
});
