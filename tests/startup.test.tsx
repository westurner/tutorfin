import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

const frameCallbacks: Array<() => void> = [];
const worldStub = { __id: 'startup-world' };

const spawnPlayer = vi.fn();
const spawnCamera = vi.fn();
const playerDestroy = vi.fn();

vi.mock('@react-three/fiber', () => ({
	useFrame: (cb: () => void) => {
		frameCallbacks.push(cb);
	},
}));

vi.mock('koota/react', () => ({
	useWorld: () => worldStub,
	useActions: () => ({
		spawnPlayer: () => {
			spawnPlayer();
			return { destroy: playerDestroy };
		},
		spawnCamera: (pos: [number, number, number]) => spawnCamera(pos),
	}),
}));

const updateSpatialHashing = vi.fn();
vi.mock('../src/systems/update-spatial-hashing', () => ({
	updateSpatialHashing: (w: unknown) => updateSpatialHashing(w),
}));

import { Startup } from '../src/startup';

describe('Startup', () => {
	beforeEach(() => {
		frameCallbacks.length = 0;
		spawnPlayer.mockClear();
		spawnCamera.mockClear();
		playerDestroy.mockClear();
		updateSpatialHashing.mockClear();
		cleanup();
	});

	it('spawns camera + player on mount and runs spatial hashing each frame', () => {
		render(<Startup initialCameraPosition={[1, 2, 3]} />);
		expect(spawnCamera).toHaveBeenCalledWith([1, 2, 3]);
		expect(spawnPlayer).toHaveBeenCalledTimes(1);

		expect(frameCallbacks).toHaveLength(1);
		frameCallbacks[0]();
		expect(updateSpatialHashing).toHaveBeenCalledWith(worldStub);
	});

	it('uses the default camera position when none is provided and destroys the player on unmount', () => {
		const { unmount } = render(<Startup />);
		expect(spawnCamera).toHaveBeenCalledWith([0, 0, 50]);
		unmount();
		expect(playerDestroy).toHaveBeenCalledTimes(1);
	});
});
