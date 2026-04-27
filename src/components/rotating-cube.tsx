import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Box } from '@react-three/flex';

export function RotatingCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Box margin={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </Box>
  );
}
