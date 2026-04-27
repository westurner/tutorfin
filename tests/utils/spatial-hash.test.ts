import { describe, it, expect, beforeEach } from 'vitest';
import { SpatialHashMap } from '../../src/utils/spatial-hash';
import { Entity } from 'koota';

const mkEntity = (n: number): Entity => n as unknown as Entity;

describe('SpatialHashMap', () => {
	let hash: SpatialHashMap;

	beforeEach(() => {
		hash = new SpatialHashMap(10);
	});

	it('places an entity in a cell and finds it via radius query', () => {
		hash.setEntity(mkEntity(1), 5, 5, 5);
		const out = hash.getNearbyEntities(0, 0, 0, 20);
		expect(out).toContain(mkEntity(1));
	});

	it('removes an entity when re-inserted into a different cell', () => {
		const e = mkEntity(2);
		hash.setEntity(e, 1, 1, 1);
		hash.setEntity(e, 100, 100, 100);

		const near0 = hash.getNearbyEntities(0, 0, 0, 5);
		expect(near0).not.toContain(e);

		const nearFar = hash.getNearbyEntities(100, 100, 100, 5);
		expect(nearFar).toContain(e);
	});

	it('respects maxEntities cap', () => {
		for (let i = 0; i < 10; i++) hash.setEntity(mkEntity(i), 0, 0, 0);
		const out = hash.getNearbyEntities(0, 0, 0, 5, [], 3);
		expect(out.length).toBe(3);
	});

	it('removeEntity drops it from queries', () => {
		const e = mkEntity(42);
		hash.setEntity(e, 0, 0, 0);
		hash.removeEntity(e);
		expect(hash.getNearbyEntities(0, 0, 0, 5)).not.toContain(e);
	});

	it('reset clears all state', () => {
		hash.setEntity(mkEntity(1), 0, 0, 0);
		hash.reset();
		expect(hash.getNearbyEntities(0, 0, 0, 100)).toEqual([]);
	});

	it('groups entities by cellSize', () => {
		// cellSize=10 means coords [0,10) hash same as [0,10)
		hash.setEntity(mkEntity(1), 0, 0, 0);
		hash.setEntity(mkEntity(2), 9.9, 9.9, 9.9);
		const out = hash.getNearbyEntities(5, 5, 5, 0);
		expect(out).toEqual(expect.arrayContaining([mkEntity(1), mkEntity(2)]));
	});

	it('is a no-op when an entity is re-set into the same cell', () => {
		const e = mkEntity(7);
		hash.setEntity(e, 1, 1, 1);
		hash.setEntity(e, 2, 2, 2); // same cell (cellSize=10)
		const out = hash.getNearbyEntities(0, 0, 0, 5);
		expect(out.filter((x) => x === e)).toHaveLength(1);
	});
});
