import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** Justify content of the flex wrap container */
  align?: 'center' | 'start' | 'end';
}

/**
 * Word-by-word / Segment-by-segment staggered blur-in animation (IntersectionObserver).
 * Uses Intl.Segmenter to accurately segment both CJK (Traditional Chinese) and Latin words.
 */
const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = '',
  delay = 0,
  align = 'center',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  const words = useMemo(() => {
    if (!text) return [];
    if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
      try {
        const segmenter = new (Intl as any).Segmenter('zh-TW', { granularity: 'word' });
        const segments: string[] = [];
        for (const { segment } of segmenter.segment(text)) {
          if (segment.trim().length > 0) {
            segments.push(segment);
          }
        }
        if (segments.length > 0) return segments;
      } catch {
        /* fallback to regex */
      }
    }
    // Fallback: split by whitespace or CJK boundary
    return text.split(/(\s+|[，、。！？；：])/).filter((s) => s.trim().length > 0);
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const justifyContent =
    align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : 'center';

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent,
        rowGap: '0.1em',
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          style={{ marginRight: '0.28em' }}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={
            visible
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : { filter: 'blur(10px)', opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.7,
            delay: delay + Math.min(i * 0.05, 1.2),
            ease: 'easeOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
