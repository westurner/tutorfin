import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

vi.mock('@react-three/postprocessing', () => ({
	EffectComposer: ({ children, multisampling }: { children?: React.ReactNode; multisampling?: number }) =>
		React.createElement(
			'div',
			{ 'data-testid': 'effect-composer', 'data-multisampling': multisampling },
			children
		),
	Bloom: (props: Record<string, unknown>) =>
		React.createElement('div', { 'data-testid': 'bloom', 'data-intensity': props.intensity as number }),
	SMAA: () => React.createElement('div', { 'data-testid': 'smaa' }),
}));

import { PostProcessing } from '../../src/components/postprocessing';

describe('PostProcessing', () => {
	it('composes Bloom and SMAA inside the EffectComposer with expected props', () => {
		const { getByTestId } = render(<PostProcessing />);
		const composer = getByTestId('effect-composer');
		expect(composer.getAttribute('data-multisampling')).toBe('1');
		const bloom = getByTestId('bloom');
		expect(bloom.getAttribute('data-intensity')).toBe('0.4');
		expect(getByTestId('smaa')).toBeTruthy();
	});
});
