import { useMemo } from "react";
import { createCandleShape } from "@/lib/cake-geometry";
import Flame from "./Flame";

export type CandleState = "lit" | "extinguished";

type CandleProps = {
  digit: "2" | "0";
  position: [number, number, number];
  state: CandleState;
  reducedMotion: boolean;
};

export default function Candle({ digit, position, state, reducedMotion }: CandleProps) {
  const shape = useMemo(() => createCandleShape(digit), [digit]);

  return (
    <group position={position}>
      <mesh castShadow position={[0, 0, -0.055]}>
        <extrudeGeometry args={[shape, {
          depth: 0.11,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.018,
          bevelThickness: 0.018,
          curveSegments: 16,
        }]} />
        <meshStandardMaterial color="#7d9b76" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.885, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.09, 6]} />
        <meshStandardMaterial color="#4a3e30" />
      </mesh>
      <Flame lit={state === "lit"} reducedMotion={reducedMotion} phase={digit === "2" ? 0 : 2} />
    </group>
  );
}
