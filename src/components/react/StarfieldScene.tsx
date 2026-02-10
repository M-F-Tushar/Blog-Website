/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

interface StarfieldSceneProps {
  starCount: number;
  depth: number;
  speed: number;
  paused: boolean;
}

function SceneContent({ starCount, depth, speed, paused }: StarfieldSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current || paused) return;
    const targetX = mouse.current.y * 0.02;
    const targetY = mouse.current.x * 0.02;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={100}
        depth={depth}
        count={starCount}
        factor={4}
        saturation={0}
        fade
        speed={speed}
      />
      <pointLight position={[-30, 20, -20]} color="#06b6d4" intensity={0.3} />
      <pointLight position={[30, -10, -30]} color="#8b5cf6" intensity={0.2} />
    </group>
  );
}

export default function StarfieldScene(props: StarfieldSceneProps) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 1], fov: 75 }}
      frameloop={props.paused ? 'demand' : 'always'}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}
