import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/use-in-view';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
}

export function AnimatedCounter({ end, duration = 2000, suffix = '', label }: AnimatedCounterProps) {
  const [ref, isInView] = useInView({ threshold: 0.5, triggerOnce: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl">
      <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2 text-glow">
        {count}{suffix}
      </div>
      <div className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-semibold">
        {label}
      </div>
    </div>
  );
}
