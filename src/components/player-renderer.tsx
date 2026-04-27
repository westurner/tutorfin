import { useGLTF } from '@react-three/drei';
import { A11y } from '@react-three/a11y';
import { Entity } from 'koota';
import { useQueryFirst } from 'koota/react';
import { useRef, MutableRefObject, useCallback } from 'react';
import * as THREE from 'three';
import { Group } from 'three';
import src from '../assets/ships/fighter.glb?url';
import { IsPlayer, Transform, Ref } from '../traits';

export function PlayerView({ entity }: { entity: Entity }) {
	const { scene } = useGLTF(src);
	const groupRef = useRef<Group | null>(null) as MutableRefObject<Group | null>;

	// Set up initial state with useCallback
	const setInitial = useCallback(
		(group: Group | null) => {
			if (!group) return;
			groupRef.current = group;

			// Initialize with default position at origin
			entity.add(Ref(scene));
			if (!entity.has(Transform)) {
				entity.set(Transform, {
					position: new THREE.Vector3(0, 0, 0),
					rotation: new THREE.Euler(0, 0, 0),
					scale: new THREE.Vector3(1, 1, 1),
				});
			}
		},
		[entity, scene]
	);

	return (
		<A11y role="content" description="Player ship">
			<group ref={setInitial}>
				<primitive object={scene} />
			</group>
		</A11y>
	);
}

// Query for the first player entity and render it
export function PlayerRenderer() {
	const player = useQueryFirst(IsPlayer, Transform);
	return player ? <PlayerView entity={player} /> : null;
}
