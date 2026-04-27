import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock('react-dom/client', () => ({
	default: { createRoot: createRootMock },
	createRoot: createRootMock,
}));

vi.mock('../src/styles.css', () => ({}));

vi.mock('../src/app', () => ({
	App: () => React.createElement('div', { 'data-testid': 'app' }),
}));

vi.mock('koota/react', () => ({
	WorldProvider: ({ children }: { children?: React.ReactNode }) =>
		React.createElement('div', { 'data-testid': 'world-provider' }, children),
}));

const worldStub = { __id: 'main-world' };
vi.mock('../src/world', () => ({ world: worldStub }));

describe('main entrypoint', () => {
	beforeEach(() => {
		renderMock.mockClear();
		createRootMock.mockClear();
		document.body.innerHTML = '<div id="root"></div>';
		vi.resetModules();
	});

	it('mounts the App into #root via createRoot', async () => {
		await import('../src/main');
		expect(createRootMock).toHaveBeenCalledTimes(1);
		const el = createRootMock.mock.calls[0][0] as HTMLElement;
		expect(el.id).toBe('root');
		expect(renderMock).toHaveBeenCalledTimes(1);
	});
});
