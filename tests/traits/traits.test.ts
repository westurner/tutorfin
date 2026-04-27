import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createWorld } from 'koota';
import {
	Transform,
	Movement,
	Input,
	Time,
	MaxSpeed,
	IsPlayer,
	IsCamera,
	SpatialHashMap,
} from '../../src/traits';
import { SpatialHashMap as SpatialHashMapImpl } from '../../src/utils/spatial-hash';

describe('traits', () => {
	it('Transform default values', () => {
		const world = createWorld();
		const e = world.spawn(Transform);
		const t = e.get(Transform)!;
		expect(t.position).toBeInstanceOf(THREE.Vector3);
		expect(t.position.toArray()).toEqual([0, 0, 0]);
		expect(t.rotation).toBeInstanceOf(THREE.Euler);
		expect(t.scale.toArray()).toEqual([1, 1, 1]);
	});

	it('Movement defaults', () => {
		const world = createWorld();
		const e = world.spawn(Movement);
		const m = e.get(Movement)!;
		expect(m.velocity.toArray()).toEqual([0, 0, 0]);
		expect(m.thrust).toBe(1);
		expect(m.damping).toBe(0.95);
		expect(m.force.toArray()).toEqual([0, 0, 0]);
	});

	it('Input defaults', () => {
		const world = createWorld();
		const e = world.spawn(Input);
		const i = e.get(Input)!;
		expect(i.forward).toBe(0);
		expect(i.strafe).toBe(0);
		expect(i.boost).toBe(false);
		expect(i.brake).toBe(false);
		expect(i.roll).toBe(0);
		expect(i.mouseDelta.toArray()).toEqual([0, 0]);
	});

	it('Time and MaxSpeed defaults', () => {
		const world = createWorld(Time);
		const t = world.get(Time)!;
		expect(t.delta).toBe(0);
		expect(t.current).toBe(0);

		const e = world.spawn(MaxSpeed);
		expect(e.get(MaxSpeed)!.maxSpeed).toBe(1);
	});

	it('SpatialHashMap as world resource', () => {
		const world = createWorld(SpatialHashMap);
		const m = world.get(SpatialHashMap)!;
		expect(m).toBeInstanceOf(SpatialHashMapImpl);
		expect(m.cellSize).toBe(50);
	});

	it('Marker traits IsPlayer / IsCamera attach without payload', () => {
		const world = createWorld();
		const player = world.spawn(IsPlayer);
		const camera = world.spawn(IsCamera);
		expect(player.has(IsPlayer)).toBe(true);
		expect(camera.has(IsCamera)).toBe(true);
		expect(player.has(IsCamera)).toBe(false);
	});
});
