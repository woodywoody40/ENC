import React, { useEffect, useRef, useState } from 'react';

interface FadingVideoProps {
  src: string | string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Background video with smooth fade-in / fade-out on loop boundaries.
 */
const FadingVideo: React.FC<FadingVideoProps> = ({ src, className = '', style }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const fadingOut = useRef(false);
  const sources = Array.isArray(src) ? src : [src];
  const currentSrc = sources[sourceIndex % sources.length];

  useEffect(() => {
    fadingOut.current = false;
    setOpacity(0);
  }, [currentSrc]);

  const handleLoadedData = () => {
    fadingOut.current = false;
    const start = performance.now();
    const durationMs = 500;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setOpacity(t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    void videoRef.current?.play().catch(() => {});
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration || fadingOut.current) return;
    const remaining = v.duration - v.currentTime;
    if (remaining <= 0.55) {
      fadingOut.current = true;
      const start = performance.now();
      const durationMs = 550;
      const from = 1;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setOpacity(from * (1 - t));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  };

  const handleEnded = () => {
    const v = videoRef.current;
    if (!v) return;
    if (sources.length === 1) {
      v.currentTime = 0;
      fadingOut.current = false;
      void v.play().catch(() => {});
      const start = performance.now();
      const durationMs = 500;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setOpacity(t);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } else {
      setSourceIndex((i) => (i + 1) % sources.length);
    }
  };

  return (
    <video
      ref={videoRef}
      key={currentSrc}
      src={currentSrc}
      className={className}
      style={{ ...style, opacity }}
      autoPlay
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
};

export default FadingVideo;
