
import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus, MeshWobbleMaterial, Html, useProgress } from '@react-three/drei';
import { Plus, Minus } from 'lucide-react';
import * as THREE from 'three';

const Mesh = 'mesh' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-8 bg-[#030712]/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
        <div className="w-20 h-20 rounded-full flex items-center justify-center relative">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-rose-500 transition-all duration-300"
              style={{
                strokeDasharray: '226.1',
                strokeDashoffset: 226.1 - (226.1 * progress) / 100,
              }}
            />
          </svg>
          <span className="text-sm font-[900] text-white">{Math.round(progress)}%</span>
        </div>
      </div>
    </Html>
  );
};

interface ProjectModelProps {
  type: string;
  isInteracting: boolean;
}

const ProjectModel: React.FC<ProjectModelProps> = ({ type, isInteracting }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const targetScale = isInteracting ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const materialProps = {
    emissive: isInteracting ? new THREE.Color('#f43f5e') : new THREE.Color('#000000'),
    emissiveIntensity: isInteracting ? 0.5 : 0,
  };

  if (type === '1') {
    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshDistortMaterial 
            color="#f43f5e" 
            speed={5} 
            distort={0.5} 
            {...materialProps}
          />
        </Sphere>
      </Float>
    );
  }
  if (type === '2') {
    return (
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1}>
        <Box ref={meshRef} args={[1.5, 1.5, 1.5]}>
          <MeshWobbleMaterial 
            color="#8b5cf6" 
            speed={1} 
            factor={0.6} 
            {...materialProps}
          />
        </Box>
      </Float>
    );
  }
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Torus ref={meshRef} args={[1, 0.4, 16, 100]}>
        <MeshStandardMaterial 
          color="#ec4899" 
          metalness={0.9} 
          roughness={0.1} 
          {...materialProps}
        />
      </Torus>
    </Float>
  );
};

interface ProjectViewerProps {
  type: string;
}

const ProjectViewer3D: React.FC<ProjectViewerProps> = ({ type }) => {
  const controlsRef = useRef<any>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const handleZoomIn = () => {
    setActiveBtn('in');
    setTimeout(() => setActiveBtn(null), 150);
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(0.85);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    setActiveBtn('out');
    setTimeout(() => setActiveBtn(null), 150);
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(1.15);
      controlsRef.current.update();
    }
  };

  // 定義 OrbitControls 的 props 並進行型別斷言以繞過特定版本的嚴格檢查
  const controlsProps = {
    ref: controlsRef,
    enableZoom: true,
    autoRotate: !isInteracting,
    autoRotateSpeed: 0.5,
    enableDamping: true,
    dampingFactor: 0.05,
    onStart: () => setIsInteracting(true),
    onEnd: () => setIsInteracting(false)
  } as any;

  return (
    <div 
      className={`w-full h-[500px] cursor-grab active:cursor-grabbing bg-white/[0.01] border rounded-[3.5rem] overflow-hidden relative group outline-none transition-all duration-500 shadow-inner ${
        isInteracting ? 'border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.1)]' : 'border-white/5'
      }`}
      tabIndex={0}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
    >
      <div className="absolute top-10 left-10 z-10 flex flex-col gap-3 pointer-events-none">
        <h4 className={`text-white font-[900] text-xs tracking-[0.4em] uppercase flex items-center gap-4 transition-colors duration-300 ${isInteracting ? 'text-rose-400' : ''}`}>
          <div className={`w-3 h-3 rounded-full ${isInteracting ? 'bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)]' : 'bg-rose-600'} animate-ping`} />
          3D INTERACTIVE VIEW
        </h4>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          {isInteracting ? '正在與元件互動中...' : 'ADVANCED COMPONENT SYSTEM'}
        </p>
      </div>

      <div className="absolute bottom-10 right-10 z-10 flex flex-col gap-5">
        <button 
          onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
          className={`w-14 h-14 backdrop-blur-3xl border rounded-[1.25rem] flex items-center justify-center transition-all duration-200 shadow-2xl ${
            activeBtn === 'in' 
              ? 'bg-rose-600 border-rose-400 scale-90 text-white' 
              : 'bg-black/60 border-white/10 text-white hover:text-rose-400 hover:scale-110'
          }`}
          title="放大"
        >
          <Plus size={28} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
          className={`w-14 h-14 backdrop-blur-3xl border rounded-[1.25rem] flex items-center justify-center transition-all duration-200 shadow-2xl ${
            activeBtn === 'out' 
              ? 'bg-rose-600 border-rose-400 scale-90 text-white' 
              : 'bg-black/60 border-white/10 text-white hover:text-rose-400 hover:scale-110'
          }`}
          title="縮小"
        >
          <Minus size={28} />
        </button>
      </div>

      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        onCreated={({ gl }) => {
          gl.domElement.setAttribute('tabindex', '0');
        }}
      >
        <AmbientLight intensity={0.5} />
        <PointLight position={[10, 10, 10]} intensity={2.5} color="#f43f5e" />
        <PointLight position={[-10, -10, -10]} intensity={1.5} color="#8b5cf6" />
        <Suspense fallback={<Loader />}>
          <ProjectModel type={type} isInteracting={isInteracting} />
          <OrbitControls {...controlsProps} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ProjectViewer3D;
