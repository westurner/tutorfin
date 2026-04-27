import { describe, it, expect } from 'vitest';
import { createWorld } from 'koota';
import { actions } from '../src/actions';
import { IsPlayer, IsCamera, Transform } from '../src/traits';

describe('actions', () => {
	it('spawnPlayer creates an entity with IsPlayer + Transform', () => {
		const world = createWorld();
		const { spawnPlayer } = actions(world);
		const player = spawnPlayer();
		expect(player.has(IsPlayer)).toBe(true);
		expect(player.has(Transform)).toBe(true);
	});

	it('spawnCamera places camera at the given position', () => {
		const world = createWorld();
		const { spawnCamera } = actions(world);
		const cam = spawnCamera([1, 2, 3]);
		expect(cam.has(IsCamera)).toBe(true);
		expect(cam.get(Transform)!.position.toArray()).toEqual([1, 2, 3]);
	});
});
