import { Flex } from '@react-three/flex';
import { RotatingCube } from './rotating-cube';

export function LayoutFlex() {
  return (
    //<Flex flexDirection="row" justifyContent="center" alignItems="center" size={[10, 10, 10]} position={[0, 0, 0]}>
      <RotatingCube />
    //</Flex>
  );
}
