import { describe, it, expect } from 'vitest';
import { createWorld } from 'koota';
import { Time, Transform, IsPlayer } from '../../src/traits';
import { updatePlayerRotation } from '../../src/systems/update-player-rotation';

describe('updatePlayerRotation', () => {
	it('rotates the player on Y proportional to delta', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 0.5, current: 0 });
		const player = world.spawn(IsPlayer, Transform());
		updatePlayerRotation(world);
		expect(player.get(Transform)!.rotation.y).toBeCloseTo(0.25, 5); // 0.5 * 0.5
	});

	it('only rotates entities marked IsPlayer', () => {
		const world = createWorld(Time);
		world.set(Time, { delta: 1, current: 0 });
		const npc = world.spawn(Transform());
		updatePlayerRotation(world);
		expect(npc.get(Transform)!.rotation.y).toBe(0);
	});
});
