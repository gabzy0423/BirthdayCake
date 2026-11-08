"use client";

import { Bounds } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { Component, useEffect, useState, type ReactNode } from "react";
import Cake from "./Cake";
import CakeFallback from "./CakeFallback";

const unavailableMessage = "The 3D view is unavailable. Your birthday wishes still belong here.";

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed
      ? <CakeFallback message={unavailableMessage} />
      : this.props.children;
  }
}

function ContextGuard({ onLost }: { onLost: () => void }) {
  const renderer = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = renderer.domElement;
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", handleLoss);
    return () => canvas.removeEventListener("webglcontextlost", handleLoss);
  }, [renderer, onLost]);

  return null;
}

export default function BirthdayScene() {
  const reducedMotion = useReducedMotion() ?? true;
  const [contextLost, setContextLost] = useState(false);

  if (contextLost) return <CakeFallback message={unavailableMessage} />;

  return (
    <SceneBoundary>
      <Canvas
        orthographic
        camera={{ position: [2.3, 2.5, 6], zoom: 90, near: 0.1, far: 40 }}
        dpr={0.5}
        shadows="basic"
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        fallback={<CakeFallback message={unavailableMessage} />}
        role="img"
        aria-label="3D cream birthday cake with white frosting, sage green decorations, and lit number 20 candles"
      >
        <ContextGuard onLost={() => setContextLost(true)} />
        <ambientLight intensity={1.4} />
        <hemisphereLight args={["#fff9eb", "#a8b49a", 1.5]} />
        <directionalLight
          position={[-3, 6, 5]}
          intensity={3}
          color="#fff3de"
          castShadow
          shadow-mapSize={[256, 256]}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={4}
          shadow-camera-bottom={-2}
          shadow-normalBias={0.035}
        />
        <Bounds fit clip observe margin={1.05} maxDuration={reducedMotion ? 0 : 0.5}>
          <Cake candleState="lit" reducedMotion={reducedMotion} />
        </Bounds>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.14} />
        </mesh>
      </Canvas>
    </SceneBoundary>
  );
}
