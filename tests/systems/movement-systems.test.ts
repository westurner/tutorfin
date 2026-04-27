import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createWorld } from 'koota';
import { Time, Transform, Movement, MaxSpeed } from '../../src/traits';
import { moveEntities } from '../../src/systems/move-entities';
import { applyForce } from '../../src/systems/apply-force';
import { limitSpeed } from '../../src/systems/limit-speed';

describe('moveEntities', () => {
	it('advances position by velocity * delta and damps velocity', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0.5, current: 0 });
		const e = world.spawn(
			Transform(),
			Movement({ velocity: new THREE.Vector3(2, 0, 0), damping: 0.5 }),
		);
		moveEntities(world);
		const t = e.get(Transform)!;
		const m = e.get(Movement)!;
		expect(t.position.x).toBeCloseTo(1, 5); // 2 * 0.5
		expect(m.velocity.x).toBeCloseTo(1, 5); // 2 * 0.5 damping
	});
});

describe('applyForce', () => {
	it('adds force into velocity and damps the force', () => {
		const world = createWorld();
		const e = world.spawn(
			Movement({
				velocity: new THREE.Vector3(),
				force: new THREE.Vector3(1, 0, 0),
			}),
		);
		applyForce(world);
		const m = e.get(Movement)!;
		expect(m.velocity.x).toBeCloseTo(1, 5);
		expect(m.force.x).toBeCloseTo(0.9, 5); // 1 * (1 - 0.1)
	});

	it('zeroes out tiny forces', () => {
		const world = createWorld();
		const e = world.spawn(
			Movement({ force: new THREE.Vector3(0.001, 0, 0) }),
		);
		applyForce(world);
		expect(e.get(Movement)!.force.length()).toBe(0);
	});
});

describe('limitSpeed', () => {
	it('clamps velocity magnitude to maxSpeed', () => {
		const world = createWorld();
		const e = world.spawn(
			Movement({ velocity: new THREE.Vector3(10, 0, 0) }),
			MaxSpeed({ maxSpeed: 3 }),
		);
		limitSpeed(world);
		expect(e.get(Movement)!.velocity.length()).toBeCloseTo(3, 5);
	});

	it('leaves slower velocities untouched', () => {
		const world = createWorld();
		const e = world.spawn(
			Movement({ velocity: new THREE.Vector3(1, 0, 0) }),
			MaxSpeed({ maxSpeed: 5 }),
		);
		limitSpeed(world);
		expect(e.get(Movement)!.velocity.x).toBeCloseTo(1, 5);
	});
});
