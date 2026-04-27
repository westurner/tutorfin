import { describe, it, expect, beforeEach } from 'vitest';
import { createWorld } from 'koota';
import { Input, IsPlayer } from '../../src/traits';
import { pollInput } from '../../src/systems/poll-input';

function key(type: 'keydown' | 'keyup', k: string) {
	window.dispatchEvent(new KeyboardEvent(type, { key: k }));
}

function mouseMove(x: number, y: number) {
	const ev = new MouseEvent('mousemove');
	Object.defineProperty(ev, 'movementX', { value: x });
	Object.defineProperty(ev, 'movementY', { value: y });
	window.dispatchEvent(ev);
}

beforeEach(() => {
	// Reset module state by issuing keyups for every tracked key
	for (const k of ['w', 's', 'a', 'd', ' ', 'q', 'r']) key('keyup', k);
});

describe('pollInput keyboard handlers', () => {
	it.each([
		['w', { forward: 1 }],
		['arrowup', { forward: 1 }],
		['s', { brake: true }],
		['arrowdown', { brake: true }],
		['a', { strafe: -1 }],
		['arrowleft', { strafe: -1 }],
		['d', { strafe: 1 }],
		['arrowright', { strafe: 1 }],
		[' ', { boost: true }],
		['q', { roll: -1 }],
		['r', { roll: 1 }],
	])('keydown "%s" sets the right state', (k, expected) => {
		const world = createWorld();
		const player = world.spawn(IsPlayer, Input);
		key('keydown', k);
		pollInput(world);
		const inp = player.get(Input)!;
		for (const [field, val] of Object.entries(expected)) {
			expect((inp as any)[field]).toBe(val);
		}
		key('keyup', k);
	});

	it('keyup resets state to default', () => {
		const world = createWorld();
		const player = world.spawn(IsPlayer, Input);
		key('keydown', 'w');
		key('keyup', 'w');
		pollInput(world);
		expect(player.get(Input)!.forward).toBe(0);
	});

	it('roll keyup only resets if its key caused the roll', () => {
		const world = createWorld();
		const player = world.spawn(IsPlayer, Input);
		key('keydown', 'q'); // roll = -1
		key('keyup', 'r'); // r didn't cause it; should NOT reset
		pollInput(world);
		expect(player.get(Input)!.roll).toBe(-1);
		key('keyup', 'q');
	});
});

describe('pollInput mouse', () => {
	it('does not accumulate mouse delta when pointer is not locked', () => {
		const world = createWorld();
		const player = world.spawn(IsPlayer, Input);
		mouseMove(50, 25);
		pollInput(world);
		expect(player.get(Input)!.mouseDelta.x).toBe(0);
		expect(player.get(Input)!.mouseDelta.y).toBe(0);
	});
});

describe('pollInput pointer-lock + click', () => {
	it('click on window invokes pointer-lock request without throwing', () => {
		// jsdom has no canvas in the DOM; the requestPointerLock branch returns early
		expect(() => window.dispatchEvent(new MouseEvent('click'))).not.toThrow();
	});

	it('pointerlockchange handler runs without throwing', () => {
		expect(() =>
			document.dispatchEvent(new Event('pointerlockchange')),
		).not.toThrow();
	});

	it('with a canvas mounted, requestPointerLock is invoked from keydown', () => {
		const canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		let called = false;
		canvas.requestPointerLock = () => {
			called = true;
		};
		key('keydown', 'w');
		key('keyup', 'w');
		canvas.remove();
		expect(called).toBe(true);
	});

	it('falls back to vendor-prefixed pointer-lock APIs when standard is missing', () => {
		const canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		// Strip standard, provide moz fallback
		(canvas as any).requestPointerLock = undefined;
		let mozCalled = false;
		(canvas as any).mozRequestPointerLock = () => {
			mozCalled = true;
		};
		key('keydown', 'a');
		key('keyup', 'a');
		canvas.remove();
		expect(mozCalled).toBe(true);
	});

	it('falls back to webkit-prefixed pointer-lock when moz is also missing', () => {
		const canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		(canvas as any).requestPointerLock = undefined;
		(canvas as any).mozRequestPointerLock = undefined;
		let webkitCalled = false;
		(canvas as any).webkitRequestPointerLock = () => {
			webkitCalled = true;
		};
		key('keydown', 'a');
		key('keyup', 'a');
		canvas.remove();
		expect(webkitCalled).toBe(true);
	});

	it('mouse delta accumulates when pointer is locked', () => {
		const canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		// Fake pointer-lock by stubbing pointerLockElement
		Object.defineProperty(document, 'pointerLockElement', {
			configurable: true,
			get: () => canvas,
		});
		document.dispatchEvent(new Event('pointerlockchange'));

		const world = createWorld();
		const player = world.spawn(IsPlayer, Input);
		mouseMove(10, 20);
		pollInput(world);
		expect(player.get(Input)!.mouseDelta.x).toBe(10);
		expect(player.get(Input)!.mouseDelta.y).toBe(20);

		// Restore
		Object.defineProperty(document, 'pointerLockElement', {
			configurable: true,
			value: null,
		});
		document.dispatchEvent(new Event('pointerlockchange'));
		canvas.remove();
	});
});
