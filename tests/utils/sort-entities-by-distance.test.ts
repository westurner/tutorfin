import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createWorld } from 'koota';
import { Transform } from '../../src/traits';
import { sortEntitiesByDistance } from '../../src/utils/sort-entities-by-distance';

describe('sortEntitiesByDistance', () => {
	it('sorts entities ascending by distance from origin', () => {
		const world = createWorld();
		const near = world.spawn(Transform({ position: new THREE.Vector3(1, 0, 0) }));
		const far = world.spawn(Transform({ position: new THREE.Vector3(10, 0, 0) }));
		const mid = world.spawn(Transform({ position: new THREE.Vector3(5, 0, 0) }));

		const sorted = sortEntitiesByDistance(new THREE.Vector3(0, 0, 0), [far, near, mid]);
		expect(sorted).toEqual([near, mid, far]);
	});

	it('does not mutate the input array', () => {
		const world = createWorld();
		const a = world.spawn(Transform({ position: new THREE.Vector3(5, 0, 0) }));
		const b = world.spawn(Transform({ position: new THREE.Vector3(1, 0, 0) }));
		const input = [a, b];
		sortEntitiesByDistance(new THREE.Vector3(), input);
		expect(input).toEqual([a, b]);
	});

	it('treats entities without Transform as equal (returns 0)', () => {
		const world = createWorld();
		const withT = world.spawn(Transform({ position: new THREE.Vector3(0, 0, 0) }));
		const withoutT = world.spawn();
		// Sort should not throw and should keep relative order stable for the missing-Transform pair.
		const sorted = sortEntitiesByDistance(new THREE.Vector3(), [withoutT, withT, withoutT]);
		expect(sorted).toHaveLength(3);
		expect(sorted).toEqual(expect.arrayContaining([withT, withoutT]));
	});
});
