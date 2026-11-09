import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export default function Smoke({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  useFrame(({ invalidate }, delta) => {
    if (!group.current || elapsed.current > 1.8) return;
    elapsed.current += Math.min(delta, 0.05);
    const age = Math.max(0, elapsed.current - 0.3);
    group.current.visible = elapsed.current > 0.3 && age < 1.4;
    group.current.children.forEach((child, index) => {
      const puff = child as Mesh<SphereGeometry, MeshBasicMaterial>;
      puff.position.y = 0.95 + index * 0.055 + (reducedMotion ? 0 : age * 0.25);
      puff.position.x = reducedMotion ? 0 : Math.sin(age * 2 + index) * age * 0.06;
      puff.scale.setScalar(0.035 + index * 0.008 + age * 0.025);
      puff.material.opacity = Math.max(0, 0.3 * (1 - age / 1.4));
    });
    invalidate();
  });
  return <group ref={group} visible={false}>
    {[0, 1, 2, 3, 4].map((index) => <mesh key={index}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshBasicMaterial color="#aab0a4" transparent opacity={0} depthWrite={false} />
    </mesh>)}
  </group>;
}
