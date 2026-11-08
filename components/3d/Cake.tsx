import Candle, { type CandleState } from "./Candle";

type CakeProps = {
  candleState: CandleState;
  reducedMotion: boolean;
};

const icing = Array.from({ length: 24 }, (_, index) => {
  const angle = (index / 24) * Math.PI * 2;
  return { x: Math.cos(angle) * 0.97, z: Math.sin(angle) * 0.97 };
});

const drips = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  return {
    x: Math.cos(angle) * 1.015,
    z: Math.sin(angle) * 1.015,
    length: index % 2 === 0 ? 0.15 : 0.09,
  };
});

export default function Cake({ candleState, reducedMotion }: CakeProps) {
  return (
    <group>
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[1.35, 1.3, 0.12, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[1.04, 1.06, 0.84, 64]} />
        <meshStandardMaterial color="#f5eedc" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
        <cylinderGeometry args={[1.055, 1.06, 0.12, 64]} />
        <meshStandardMaterial color="#fffefa" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.055, 0.025, 8, 64]} />
        <meshStandardMaterial color="#7d9b76" roughness={0.7} />
      </mesh>
      {drips.map(({ x, z, length }, index) => (
        <mesh key={index} position={[x, 0.94 - length / 2, z]} scale={[0.065, length, 0.065]}>
          <sphereGeometry args={[1, 10, 12]} />
          <meshStandardMaterial color="#fffefa" roughness={0.65} />
        </mesh>
      ))}
      {icing.map(({ x, z }, index) => (
        <group key={index}>
          <mesh castShadow position={[x, 1.045, z]} scale={[0.105, 0.07, 0.105]}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color="#fffefa" roughness={0.65} />
          </mesh>
          <mesh position={[x, 0.15, z]} scale={[0.08, 0.05, 0.08]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#7d9b76" roughness={0.65} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.7, 1.065, 0.35]} rotation={[0, side * 0.6, 0]}>
          <mesh scale={[0.15, 0.035, 0.065]} rotation={[0, 0.4, 0]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color="#7d9b76" roughness={0.75} />
          </mesh>
          <mesh position={[0.04, 0.01, 0.1]} scale={[0.07, 0.035, 0.14]} rotation={[0, -0.4, 0]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color="#92aa86" roughness={0.75} />
          </mesh>
        </group>
      ))}
      <Candle digit="2" position={[-0.37, 1.04, 0]} state={candleState} reducedMotion={reducedMotion} />
      <Candle digit="0" position={[0.37, 1.04, 0]} state={candleState} reducedMotion={reducedMotion} />
    </group>
  );
}
