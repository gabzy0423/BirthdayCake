import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import { cakeLandingY } from "@/lib/cake-landing";

export default function CakeLanding({ children, reducedMotion, onLanded }: {
  children: ReactNode;
  reducedMotion: boolean | null;
  onLanded: () => void;
}) {
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  const frames = useRef(0);
  const complete = useRef(false);

  useFrame(({ invalidate }, delta) => {
    if (!group.current || complete.current || reducedMotion === null) return;
    invalidate();
    // Let Bounds frame the resting cake before moving its visible geometry.
    if (frames.current++ < 2) return;
    elapsed.current += Math.min(delta, 0.05);
    const progress = reducedMotion ? 1 : Math.min(elapsed.current / 0.9, 1);
    group.current.visible = true;
    group.current.position.y = progress === 1 ? 0 : cakeLandingY(progress);
    if (progress === 1) {
      complete.current = true;
      onLanded();
    }
  });

  return <group ref={group} visible={false}>{children}</group>;
}
