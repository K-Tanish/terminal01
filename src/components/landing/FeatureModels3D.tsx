import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

const LIME = '#bfff2b';

// --- Model 1: Real-Time Telemetry (Nested Torus Rings) ---
function TelemetryRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <group ref={groupRef}>
        <mesh>
          <torusGeometry args={[1.5, 0.05, 16, 100]} />
          <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.03, 16, 100]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.9, 0.08, 16, 100]} />
          <MeshTransmissionMaterial transmission={0.9} thickness={0.5} roughness={0.1} color="#e8ffe0" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={LIME} />
        </mesh>
      </group>
    </Float>
  );
}

export function TelemetryModel() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ width: '100%', height: '300px' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <TelemetryRings />
      <Environment preset="city" />
    </Canvas>
  );
}

// --- Model 2: High-Density Grid (Pulsing Cubes) ---
function PulsingGrid() {
  const count = 27; // 3x3x3
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    let i = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          dummy.position.set(x * 0.8, y * 0.8, z * 0.8);
          // Calculate distance from center for wave effect
          const dist = Math.sqrt(x * x + y * y + z * z);
          const scale = 0.5 + Math.sin(time * 3 - dist * 2) * 0.2;
          dummy.scale.set(scale, scale, scale);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i++, dummy.matrix);
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.x = time * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <MeshTransmissionMaterial transmission={0.8} thickness={0.2} roughness={0.2} color="#ffffff" />
      </instancedMesh>
    </Float>
  );
}

export function GridModel() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ width: '100%', height: '300px' }}>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 0, 0]} intensity={5} color={LIME} distance={10} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <PulsingGrid />
      <Environment preset="studio" />
    </Canvas>
  );
}

// --- Model 3: Fuzzy Search (Floating Nodes) ---
function FloatingNodes() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={2} floatIntensity={3}>
      <group ref={groupRef}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color={LIME} wireframe />
        </mesh>
        <mesh position={[1.5, 1.2, 0.5]}>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-1.2, -1.5, -0.8]}>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#a0a0a0" />
        </mesh>
        <mesh position={[1.0, -1.0, 1.2]}>
          <icosahedronGeometry args={[0.5, 1]} />
          <MeshTransmissionMaterial transmission={1} thickness={0.5} roughness={0.1} color="#e8ffe0" />
        </mesh>
        <mesh position={[-1.5, 1.0, 0.2]}>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={2} />
        </mesh>
      </group>
    </Float>
  );
}

export function SearchModel() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ width: '100%', height: '300px' }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      <FloatingNodes />
      <Environment preset="city" />
    </Canvas>
  );
}
