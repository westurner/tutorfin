import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

const frameCallbacks: Array<() => void> = [];

vi.mock('@react-three/fiber', () => ({
	useFrame: (cb: () => void) => {
		frameCallbacks.push(cb);
	},
}));

const worldStub = { __id: 'test-world' };
vi.mock('koota/react', () => ({
	useWorld: () => worldStub,
}));

const updateTime = vi.fn();
const updatePlayerRotation = vi.fn();
const syncView = vi.fn();
vi.mock('../src/systems/update-time', () => ({ updateTime: (w: unknown) => updateTime(w) }));
vi.mock('../src/systems/update-player-rotation', () => ({
	updatePlayerRotation: (w: unknown) => updatePlayerRotation(w),
}));
vi.mock('../src/systems/sync-view', () => ({ syncView: (w: unknown) => syncView(w) }));

import { GameLoop } from '../src/gameloop';

describe('GameLoop', () => {
	beforeEach(() => {
		frameCallbacks.length = 0;
		updateTime.mockClear();
		updatePlayerRotation.mockClear();
		syncView.mockClear();
	});

	it('registers a frame callback that drives the per-frame systems in order', () => {
		const { container } = render(<GameLoop />);
		expect(container.firstChild).toBeNull();
		expect(frameCallbacks).toHaveLength(1);

		frameCallbacks[0]();

		expect(updateTime).toHaveBeenCalledWith(worldStub);
		expect(updatePlayerRotation).toHaveBeenCalledWith(worldStub);
		expect(syncView).toHaveBeenCalledWith(worldStub);

		const order = [
			updateTime.mock.invocationCallOrder[0],
			updatePlayerRotation.mock.invocationCallOrder[0],
			syncView.mock.invocationCallOrder[0],
		];
		expect(order).toEqual([...order].sort((a, b) => a - b));
	});
});
