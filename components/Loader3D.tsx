
import React from 'react';
import { Html, useProgress } from '@react-three/drei';

const Loader3D: React.FC = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center relative neu-out">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-cyan-500 transition-all duration-300"
              style={{
                strokeDasharray: '251.2',
                strokeDashoffset: 251.2 - (251.2 * progress) / 100,
              }}
            />
          </svg>
          <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
        </div>
        <p className="mt-4 text-xs font-black tracking-[0.3em] uppercase text-gray-400">正在建構虛擬場景...</p>
      </div>
    </Html>
  );
};

export default Loader3D;
