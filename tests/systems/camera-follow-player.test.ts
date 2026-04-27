import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createWorld } from 'koota';
import { Transform, IsPlayer, IsCamera } from '../../src/traits';
import { cameraFollowPlayer } from '../../src/systems/camera-follow-player';

describe('cameraFollowPlayer', () => {
	it('returns early when no player exists', () => {
		const world = createWorld();
		const cam = world.spawn(IsCamera, Transform());
		const before = cam.get(Transform)!.position.clone();
		cameraFollowPlayer(world);
		expect(cam.get(Transform)!.position).toEqual(before);
	});

	it('lerps the camera toward the offset behind the player', () => {
		const world = createWorld();
		world.spawn(IsPlayer, Transform({ position: new THREE.Vector3(0, 0, 0) }));
		const cam = world.spawn(
			IsCamera,
			Transform({ position: new THREE.Vector3(100, 100, 100) }),
		);
		cameraFollowPlayer(world);
		// positionDamping=0.05; camera should have moved toward target (small lerp)
		const p = cam.get(Transform)!.position;
		expect(p.x).toBeLessThan(100);
		expect(p.y).toBeLessThan(100);
		expect(p.z).toBeLessThan(100);
	});

	it('clamps camera into [minDistance, maxDistance] when too close', () => {
		const world = createWorld();
		world.spawn(IsPlayer, Transform({ position: new THREE.Vector3(0, 0, 0) }));
		const cam = world.spawn(
			IsCamera,
			Transform({ position: new THREE.Vector3(0.5, 0, 0) }),
		);
		cameraFollowPlayer(world);
		const p = cam.get(Transform)!.position;
		expect(p.length()).toBeGreaterThanOrEqual(5 - 0.001);
	});

	it('clamps camera into [minDistance, maxDistance] when too far', () => {
		const world = createWorld();
		world.spawn(IsPlayer, Transform({ position: new THREE.Vector3(0, 0, 0) }));
		const cam = world.spawn(
			IsCamera,
			Transform({ position: new THREE.Vector3(100, 0, 0) }),
		);
		cameraFollowPlayer(world);
		const p = cam.get(Transform)!.position;
		expect(p.length()).toBeLessThanOrEqual(12 + 0.001);
	});

	it('uses player rotation to rotate the offset', () => {
		const world = createWorld();
		world.spawn(
			IsPlayer,
			Transform({
				position: new THREE.Vector3(0, 0, 0),
				rotation: new THREE.Euler(0, Math.PI / 2, 0),
			}),
		);
		const cam = world.spawn(IsCamera, Transform());
		cameraFollowPlayer(world);
		// With Y rotation, the offset (0,2,8) rotates around Y, so X picks up some value
		expect(cam.get(Transform)!.position.x).not.toBe(0);
	});
});
