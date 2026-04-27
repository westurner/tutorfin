import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createWorld } from 'koota';
import { SpatialHashMap, Transform } from '../../src/traits';
import { updateSpatialHashing } from '../../src/systems/update-spatial-hashing';

describe('updateSpatialHashing', () => {
	it('inserts every Transform-bearing entity into the spatial hash', () => {
		const world = createWorld(SpatialHashMap);
		const e = world.spawn(Transform({ position: new THREE.Vector3(5, 5, 5) }));
		updateSpatialHashing(world);
		const m = world.get(SpatialHashMap)!;
		const found = m.getNearbyEntities(5, 5, 5, 1);
		expect(found).toContain(e);
	});

	it('removes an entity from the hash when its Transform is removed', () => {
		const world = createWorld(SpatialHashMap);
		const e = world.spawn(Transform({ position: new THREE.Vector3(5, 5, 5) }));
		updateSpatialHashing(world);
		e.remove(Transform);
		updateSpatialHashing(world);
		const m = world.get(SpatialHashMap)!;
		expect(m.getNearbyEntities(5, 5, 5, 1)).not.toContain(e);
	});
});
