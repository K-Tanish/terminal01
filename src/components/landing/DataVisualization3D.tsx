import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const LIME = '#bfff2b';
const LIME_DARK = '#8ed100';
/* ─── Small cubes instanced mesh ─────────────────────────────────────── */
interface CubeData {
  base: THREE.Vector3;
  color: THREE.Color;
  emissive: THREE.Color;
  emissiveIntensity: number;
  phase: number;
  freq: number;
  amp: number;
}

function useSmallCubeData(): CubeData[] {
  return useMemo(() => {
    const COLS = 5, ROWS = 4, DEPTH = 5;
    const STRIDE = 0.38;
    const HALF_C = ((COLS - 1) * STRIDE) / 2;
    const HALF_D = ((DEPTH - 1) * STRIDE) / 2;
    const data: CubeData[] = [];

    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        for (let z = 0; z < DEPTH; z++) {
          const px = x * STRIDE - HALF_C;
          const py = y * STRIDE - 0.5;
          const pz = z * STRIDE - HALF_D;
          const dist = Math.sqrt(px * px + py * py + pz * pz);
          const dxy = Math.sqrt(px * px + (py + 0.25) * (py + 0.25));

          let color: THREE.Color;
          let emissive = new THREE.Color(0x000000);
          let emissiveIntensity = 0;

          if (dxy < 0.25 && y >= 1 && y <= 2) {
            color = new THREE.Color(LIME);
            emissive = new THREE.Color(LIME);
            emissiveIntensity = 4.0;
          } else if (dist < 0.45) {
            color = new THREE.Color('#0a0a0a');
          } else if (dist < 0.75) {
            color = new THREE.Color('#1c1c1c');
            emissive = new THREE.Color(LIME_DARK);
            emissiveIntensity = 0.4;
          } else if (dist < 1.1) {
            color = new THREE.Color('#505050');
          } else if (dist < 1.4) {
            color = new THREE.Color('#909090');
          } else if (dist < 1.7) {
            color = new THREE.Color('#c8c8c8');
          } else {
            color = new THREE.Color('#e8e8e8');
          }

          data.push({
            base: new THREE.Vector3(px, py, pz),
            color,
            emissive,
            emissiveIntensity,
            phase: Math.random() * Math.PI * 2,
            freq: 0.3 + Math.random() * 0.5,
            amp: 0.015 + Math.random() * 0.025,
          });
        }
      }
    }
    return data;
  }, []);
}

function SmallCubes() {
  const cubeData = useSmallCubeData();
  const count = cubeData.length;

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Build per-instance colors
  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      cubeData[i].color.toArray(arr, i * 3);
    }
    return arr;
  }, [count, cubeData]);

  // Set initial matrices
  useMemo(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.copy(cubeData[i].base);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const d = cubeData[i];
      dummy.position.copy(d.base);
      dummy.position.y += Math.sin(t * d.freq + d.phase) * d.amp;
      const sc = 1 + Math.sin(t * d.freq * 0.7 + d.phase + 1) * 0.012;
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.28, 0.28, 0.28]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </boxGeometry>
      <meshStandardMaterial
        vertexColors
        roughness={0.3}
        metalness={0.35}
      />
    </instancedMesh>
  );
}

/* ─── Particles streaming upward ─────────────────────────────────────── */
function Particles() {
  const count = 120;
  const posRef = useRef<THREE.BufferGeometry>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const initialPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.5;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  const speeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.005 + Math.random() * 0.012;
    return s;
  }, []);

  const posBuffer = useMemo(() => Float32Array.from(initialPositions), [initialPositions]);

  useFrame(() => {
    const geo = posRef.current;
    if (!geo) return;
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i];
      if (arr[i * 3 + 1] > 2.2) {
        arr[i * 3 + 1] = -2.0;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.45;
        arr[i * 3] = Math.cos(angle) * r;
        arr[i * 3 + 2] = Math.sin(angle) * r;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={posRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[posBuffer, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={LIME}
        size={0.065}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Glass frame layers ─────────────────────────────────────────────── */
function GlassLayers() {
  const layerRefs = useRef<(THREE.Mesh | null)[]>([]);

  const layers = useMemo(() => [
    { y: -0.57, size: 2.35, rot: 0.0 },
    { y: -0.19, size: 2.25, rot: 0.01 },
    { y:  0.19, size: 2.15, rot: -0.01 },
    { y:  0.57, size: 2.05, rot: 0.005 },
    { y:  0.95, size: 1.9,  rot: -0.005 },
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    layerRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.position.y = layers[i].y + Math.sin(t * 0.35 + i * 0.9) * 0.022;
    });
  });

  return (
    <>
      {layers.map((layer, i) => (
        <mesh
          key={i}
          ref={(el) => { layerRefs.current[i] = el; }}
          position={[0, layer.y, 0]}
          rotation={[0, layer.rot + i * 0.03, 0]}
        >
          <boxGeometry args={[layer.size, 0.03, layer.size]} />
          <MeshTransmissionMaterial
            transmission={0.92}
            roughness={0.05}
            thickness={0.06}
            chromaticAberration={0.02}
            color="#e8ffe0"
            opacity={0.45}
            transparent
          />
        </mesh>
      ))}
    </>
  );
}

/* ─── Outer glass cube ───────────────────────────────────────────────── */
function OuterGlassCube() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.18) * 0.18;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.12) * 0.04;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.18, 0]}>
      <boxGeometry args={[2.55, 2.55, 2.55]} />
      <MeshTransmissionMaterial
        transmission={0.88}
        roughness={0.02}
        thickness={0.12}
        chromaticAberration={0.04}
        color="#edffd8"
        opacity={0.22}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── Platform base ──────────────────────────────────────────────────── */
function Platform() {
  return (
    <group position={[0, -1.52, 0]}>
      {/* Main dark base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.0, 0.45, 3.0]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Neon-lime trim stripe */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[3.02, 0.04, 3.02]} />
        <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={3} roughness={0.1} />
      </mesh>
      {/* Top pedestal lighter layer */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[2.7, 0.07, 2.7]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Top white step */}
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[2.4, 0.06, 2.4]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}

/* ─── Center glow core ───────────────────────────────────────────────── */
function CenterCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      const intensity = 4.0 + Math.sin(t * 1.8) * 2.5 + Math.sin(t * 3.1) * 0.8;
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
      const sc = 0.14 + Math.sin(t * 2.2) * 0.022;
      ref.current.scale.setScalar(sc / 0.14);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.05, 0]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={3} roughness={0} />
    </mesh>
  );
}

/* ─── Neon corner wireframe accent ──────────────────────────────────── */
function NeonEdges() {
  const ref = useRef<THREE.LineSegments>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <lineSegments ref={ref} position={[0, 0.18, 0]}>
      <edgesGeometry args={[new THREE.BoxGeometry(2.56, 2.56, 2.56)]} />
      <lineBasicMaterial color={LIME} transparent opacity={0.35} linewidth={1} />
    </lineSegments>
  );
}

/* ─── Full scene ─────────────────────────────────────────────────────── */
function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.06;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-4, 3, -4]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 0.5, 0]} intensity={12} color={LIME} distance={5} decay={2} />
      <pointLight position={[0, -0.5, 0]} intensity={6} color={LIME} distance={4} decay={2} />
      <pointLight position={[0, 1.5, 0]} intensity={4} color={LIME} distance={3} decay={2} />
      <spotLight position={[0, 5, 3]} intensity={1.8} angle={0.5} penumbra={0.8} color="#ffffff" />

      <group ref={groupRef}>
        <Platform />
        <SmallCubes />
        <GlassLayers />
        <OuterGlassCube />
        <NeonEdges />
        <CenterCore />
        <Particles />
      </group>

    </>
  );
}

/* ─── Exported canvas wrapper ────────────────────────────────────────── */
export function DataVisualization3D() {
  return (
    <Canvas
      camera={{ position: [3.5, 3.2, 6.5], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0);
        scene.background = null;
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
