import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';

const sceneStub = { __t: 'scene' };

vi.mock('@react-three/drei', () => ({
	useGLTF: () => ({ scene: sceneStub }),
}));

vi.mock('@react-three/a11y', () => ({
	A11y: ({ children }: { children?: React.ReactNode }) =>
		React.createElement('div', { 'data-testid': 'a11y' }, children),
}));

let queryResult: {
	add: ReturnType<typeof vi.fn>;
	has: (t: unknown) => boolean;
	set: ReturnType<typeof vi.fn>;
} | null = null;

vi.mock('koota/react', () => ({
	useQueryFirst: () => queryResult,
}));

vi.mock('../../src/traits', () => ({
	IsPlayer: { __t: 'IsPlayer' },
	Transform: { __t: 'Transform' },
	Ref: (v: unknown) => ({ __t: 'Ref', v }),
}));

vi.mock('../../src/assets/ships/fighter.glb?url', () => ({ default: 'fighter.glb' }));

// Stub R3F-only host elements (group, primitive) by mocking them via a JSX intrinsic shim.
// In jsdom, unknown lowercase elements render as plain DOM nodes; React will warn but tests still pass.
// We intercept the `group` ref to drive the setInitial callback for both Transform-present and
// Transform-missing branches.
import { PlayerView, PlayerRenderer } from '../../src/components/player-renderer';

describe('PlayerRenderer', () => {
	beforeEach(() => {
		queryResult = null;
		cleanup();
	});

	it('returns null when there is no player entity', () => {
		queryResult = null;
		const { container } = render(<PlayerRenderer />);
		expect(container.firstChild).toBeNull();
	});

	it('renders PlayerView when a player exists', () => {
		queryResult = { add: vi.fn(), has: () => true, set: vi.fn() };
		const { getByTestId } = render(<PlayerRenderer />);
		expect(getByTestId('a11y')).toBeTruthy();
	});
});

describe('PlayerView setInitial callback', () => {
	beforeEach(() => {
		cleanup();
	});

	it('adds Ref and sets a default Transform when entity does not yet have one', () => {
		const add = vi.fn();
		const set = vi.fn();
		const entity = { add, has: () => false, set } as unknown as Parameters<typeof PlayerView>[0]['entity'];
		render(<PlayerView entity={entity} />);
		// The group ref callback runs on mount; React passes a real DOM node.
		expect(add).toHaveBeenCalledTimes(1);
		expect(add.mock.calls[0][0]).toMatchObject({ __t: 'Ref', v: sceneStub });
		expect(set).toHaveBeenCalledTimes(1);
		expect(set.mock.calls[0][0]).toMatchObject({ __t: 'Transform' });
	});

	it('does not overwrite Transform when the entity already has one', () => {
		const add = vi.fn();
		const set = vi.fn();
		const entity = { add, has: () => true, set } as unknown as Parameters<typeof PlayerView>[0]['entity'];
		render(<PlayerView entity={entity} />);
		expect(add).toHaveBeenCalledTimes(1);
		expect(set).not.toHaveBeenCalled();
	});

	it('handles a null ref invocation as a no-op', () => {
		const add = vi.fn();
		const set = vi.fn();
		const entity = { add, has: () => false, set } as unknown as Parameters<typeof PlayerView>[0]['entity'];
		const { unmount } = render(<PlayerView entity={entity} />);
		unmount(); // triggers ref(null)
		// add still called once from the mount, never again from unmount
		expect(add).toHaveBeenCalledTimes(1);
	});
});
