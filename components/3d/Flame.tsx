import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { MathUtils, type Group } from "three";

type FlameProps = {
  lit: boolean;
  reducedMotion: boolean;
  phase: number;
};

export default function Flame({ lit, reducedMotion, phase }: FlameProps) {
  const flame = useRef<Group>(null);
  const [initialScale] = useState(lit ? 1 : 0);

  useFrame(({ clock }, delta) => {
    if (!flame.current) return;
    if (reducedMotion) {
      flame.current.scale.setScalar(lit ? 1 : 0);
      flame.current.rotation.z = 0;
      return;
    }
    const time = clock.elapsedTime;
    const flicker = 1 + Math.sin(time * 11 + phase) * 0.07;
    const size = MathUtils.damp(flame.current.scale.y, lit ? flicker : 0, 10, delta);
    flame.current.scale.set(Math.min(size, 1), size, Math.min(size, 1));
    flame.current.rotation.z = Math.sin(time * 7 + phase) * 0.07;
  });

  return (
    <group ref={flame} position={[0, 1.03, 0]} scale={initialScale}>
      <mesh scale={[0.055, 0.14, 0.055]}>
        <sphereGeometry args={[1, 12, 16]} />
        <meshBasicMaterial color="#f5b956" toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.035, 0.03]} scale={[0.026, 0.075, 0.026]}>
        <sphereGeometry args={[1, 10, 12]} />
        <meshBasicMaterial color="#fff5cf" toneMapped={false} />
      </mesh>
    </group>
  );
}
