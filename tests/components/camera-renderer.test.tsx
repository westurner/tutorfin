import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';

let queryResult: { add: ReturnType<typeof vi.fn> } | null = null;
const addCalls: unknown[] = [];

vi.mock('koota/react', () => ({
	useQueryFirst: () => queryResult,
}));

let camValue: { marker: string } | null = { marker: 'cam' };

vi.mock('@react-three/drei', () => ({
	PerspectiveCamera: React.forwardRef(
		(_: { makeDefault?: boolean }, ref: React.Ref<{ marker: string }>) => {
			// Invoke callback ref like R3F would.
			if (typeof ref === 'function') (ref as (v: { marker: string } | null) => void)(camValue);
			return React.createElement('div', { 'data-testid': 'persp-camera' });
		}
	),
}));

vi.mock('../../src/traits', () => ({
	IsCamera: { __t: 'IsCamera' },
	Transform: { __t: 'Transform' },
	Ref: (v: unknown) => ({ __t: 'Ref', v }),
}));

import { CameraRenderer } from '../../src/components/camera-renderer';

describe('CameraRenderer', () => {
	beforeEach(() => {
		queryResult = null;
		addCalls.length = 0;
		camValue = { marker: 'cam' };
		cleanup();
	});

	it('renders nothing when no camera entity exists', () => {
		queryResult = null;
		const { container } = render(<CameraRenderer />);
		expect(container.firstChild).toBeNull();
	});

	it('renders PerspectiveCamera and adds Ref to the entity when a camera exists', () => {
		const add = vi.fn((v) => addCalls.push(v));
		queryResult = { add };
		const { getByTestId } = render(<CameraRenderer />);
		expect(getByTestId('persp-camera')).toBeTruthy();
		expect(add).toHaveBeenCalledTimes(1);
		expect(addCalls[0]).toMatchObject({ __t: 'Ref' });
	});

	it('does not call entity.add when the ref callback receives null', () => {
		const add = vi.fn();
		queryResult = { add };
		camValue = null;
		render(<CameraRenderer />);
		expect(add).not.toHaveBeenCalled();
	});
});
