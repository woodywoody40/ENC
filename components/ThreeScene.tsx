
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, MeshDistortMaterial, TorusKnot, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import Loader3D from './Loader3D';

// Define aliases for Three.js intrinsic elements to resolve JSX type errors
const Fog = 'fog' as any;
const AmbientLight = 'ambientLight' as any;
const SpotLight = 'spotLight' as any;

const SceneContent = ({ scrollY, isDarkMode }: { scrollY: number, isDarkMode: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollFactor = scrollY / (document.documentElement.scrollHeight || 1);

    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -scrollFactor * 30 + 5, 0.05);
      meshRef.current.rotation.x = time * 0.15;
      meshRef.current.rotation.y = time * 0.1;
      const targetScale = 1.3 + (Math.sin(time * 0.5) * 0.1);
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.008;
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.x * 2, 0.05);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mouse.y * 2, 0.05);
    }
  });

  const particles = useMemo(() => {
    const temp = new Float32Array(12000 * 3);
    for (let i = 0; i < 12000; i++) {
      temp[i * 3] = THREE.MathUtils.randFloatSpread(350);
      temp[i * 3 + 1] = THREE.MathUtils.randFloatSpread(350);
      temp[i * 3 + 2] = THREE.MathUtils.randFloatSpread(350);
    }
    return temp;
  }, []);

  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <TorusKnot ref={meshRef} args={[10, 3, 200, 32]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color={isDarkMode ? "#00f2ff" : "#2D3436"}
            speed={3}
            distort={0.4}
            metalness={0.9}
            roughness={0.1}
            wireframe
            opacity={isDarkMode ? 0.1 : 0.03}
            transparent
          />
        </TorusKnot>
      </Float>

      <Points ref={pointsRef} positions={particles} stride={3}>
        <PointMaterial
          transparent
          color={isDarkMode ? "#00f2ff" : "#2D3436"}
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending}
          opacity={isDarkMode ? 0.2 : 0.4}
        />
      </Points>
    </>
  );
};

const ThreeScene: React.FC<{ scrollY: number, isDarkMode: boolean }> = ({ scrollY, isDarkMode }) => {
  return (
    <div className={`fixed inset-0 -z-20 pointer-events-none overflow-hidden transition-colors duration-1000 ${isDarkMode ? 'bg-[#050608]' : 'bg-[#E9E5E3]'}`}>
      {/* 數位矩陣網格效果 */}
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      <Canvas camera={{ position: [0, 0, 80], fov: 35 }} dpr={[1, 2]}>
        {/* Fix: Using aliased Fog component to resolve JSX.IntrinsicElements errors for 'fog' and remove redundant lowercase tag */}
        <Fog attach="fog" args={[isDarkMode ? '#050608' : '#E9E5E3', 50, 180]} />
        <AmbientLight intensity={isDarkMode ? 0.4 : 1.5} />
        <SpotLight position={[80, 80, 80]} angle={0.25} penumbra={1} intensity={2} color={isDarkMode ? "#00f2ff" : "#ffffff"} />
        <Suspense fallback={<Loader3D />}>
          <SceneContent scrollY={scrollY} isDarkMode={isDarkMode} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeScene;
