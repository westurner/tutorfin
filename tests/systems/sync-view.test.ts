import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createWorld } from 'koota';
import { Transform, Ref } from '../../src/traits';
import { syncView } from '../../src/systems/sync-view';

describe('syncView', () => {
	it('copies transform position/rotation/scale into the Ref Object3D', () => {
		const world = createWorld();
		const obj = new THREE.Object3D();
		const e = world.spawn(
			Transform({
				position: new THREE.Vector3(1, 2, 3),
				rotation: new THREE.Euler(0.1, 0.2, 0.3),
				scale: new THREE.Vector3(2, 2, 2),
			}),
			Ref(obj),
		);
		syncView(world);
		const ref = e.get(Ref)!;
		expect(ref.position.toArray()).toEqual([1, 2, 3]);
		expect(ref.rotation.x).toBeCloseTo(0.1, 5);
		expect(ref.rotation.y).toBeCloseTo(0.2, 5);
		expect(ref.scale.toArray()).toEqual([2, 2, 2]);
	});

	it('does nothing when no entities have both Transform and Ref', () => {
		const world = createWorld();
		world.spawn(Transform()); // missing Ref
		expect(() => syncView(world)).not.toThrow();
	});
});
