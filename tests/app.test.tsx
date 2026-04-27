import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

vi.mock('@react-three/fiber', () => ({
	Canvas: ({ children, ...rest }: { children?: React.ReactNode }) =>
		React.createElement('div', { 'data-testid': 'canvas', ...rest }, children),
	useFrame: () => {},
}));

vi.mock('@react-three/a11y', () => ({
	A11yAnnouncer: () => React.createElement('div', { 'data-testid': 'a11y-announcer' }),
	A11yUserPreferences: ({ children }: { children?: React.ReactNode }) =>
		React.createElement('div', { 'data-testid': 'a11y-prefs' }, children),
	A11y: ({ children }: { children?: React.ReactNode }) =>
		React.createElement('div', null, children),
}));

vi.mock('../src/components/camera-renderer', () => ({
	CameraRenderer: () => React.createElement('div', { 'data-testid': 'camera-renderer' }),
}));

vi.mock('../src/components/player-renderer', () => ({
	PlayerRenderer: () => React.createElement('div', { 'data-testid': 'player-renderer' }),
}));

vi.mock('../src/gameloop', () => ({
	GameLoop: () => React.createElement('div', { 'data-testid': 'gameloop' }),
}));

vi.mock('../src/startup', () => ({
	Startup: ({ initialCameraPosition }: { initialCameraPosition?: number[] }) =>
		React.createElement('div', {
			'data-testid': 'startup',
			'data-pos': JSON.stringify(initialCameraPosition),
		}),
}));

import { App } from '../src/app';

describe('App', () => {
	it('mounts canvas with all child renderers and the announcer', () => {
		const { getByTestId } = render(<App />);
		expect(getByTestId('canvas')).toBeTruthy();
		expect(getByTestId('a11y-prefs')).toBeTruthy();
		expect(getByTestId('a11y-announcer')).toBeTruthy();
		expect(getByTestId('startup').getAttribute('data-pos')).toBe('[0,0,10]');
		expect(getByTestId('gameloop')).toBeTruthy();
		expect(getByTestId('camera-renderer')).toBeTruthy();
		expect(getByTestId('player-renderer')).toBeTruthy();
	});
});
