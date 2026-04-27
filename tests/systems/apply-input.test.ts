import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createWorld } from 'koota';
import { Time, Transform, Movement, Input } from '../../src/traits';
import { convertInputToMovement } from '../../src/systems/apply-input';

function spawn(world: ReturnType<typeof createWorld>, overrides: Partial<{
	forward: number;
	strafe: number;
	boost: boolean;
	brake: boolean;
	roll: number;
	mouseDelta: THREE.Vector2;
}> = {}) {
	return world.spawn(
		Input(overrides as any),
		Transform(),
		Movement({ thrust: 1 }),
	);
}

describe('convertInputToMovement', () => {
	it('forward input adds velocity along -Z (initial orientation)', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0.1, current: 0 });
		const e = spawn(world, { forward: 1 });
		convertInputToMovement(world);
		// thrust=1 * delta=0.1 * 100 * boost=1 = 10
		expect(e.get(Movement)!.velocity.z).toBeCloseTo(-10, 5);
	});

	it('boost doubles thrust force', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0.1, current: 0 });
		const e = spawn(world, { forward: 1, boost: true });
		convertInputToMovement(world);
		expect(e.get(Movement)!.velocity.z).toBeCloseTo(-20, 5);
	});

	it('strafe input pushes along +X', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0.1, current: 0 });
		const e = spawn(world, { strafe: 1 });
		convertInputToMovement(world);
		expect(e.get(Movement)!.velocity.x).toBeCloseTo(10, 5);
	});

	it('brake damps existing velocity', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0.1, current: 0 });
		const e = world.spawn(
			Input({ brake: true } as any),
			Transform(),
			Movement({ velocity: new THREE.Vector3(10, 0, 0) }),
		);
		convertInputToMovement(world);
		expect(e.get(Movement)!.velocity.x).toBeCloseTo(9.8, 5);
	});

	it('mouse delta yaws and pitches the transform', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0.016, current: 0 });
		const e = spawn(world, { mouseDelta: new THREE.Vector2(100, 50) });
		convertInputToMovement(world);
		const t = e.get(Transform)!;
		// MOUSE_SENSITIVITY = 0.005; rotation -= mouseDelta * sensitivity
		expect(t.rotation.y).toBeCloseTo(-0.5, 5);
		expect(t.rotation.x).toBeCloseTo(-0.25, 5);
	});

	it('roll key rotates Z', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0.1, current: 0 });
		const e = spawn(world, { roll: 1 });
		convertInputToMovement(world);
		// ROLL_SPEED = 3.0 * 0.1 = 0.3
		expect(e.get(Transform)!.rotation.z).toBeCloseTo(0.3, 5);
	});
});
