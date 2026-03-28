import { useInView } from '@/hooks/use-in-view';

interface SkillBarProps {
  name: string;
  percentage: number;
  delay?: number;
}

export function SkillBar({ name, percentage, delay = 0 }: SkillBarProps) {
  const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div ref={ref} className="mb-6 w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-foreground tracking-wide">{name}</span>
        <span className="text-sm font-medium text-primary font-display">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full relative"
          style={{ 
            width: isInView ? `${percentage}%` : '0%',
            transition: `width 1.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          }}
        >
          <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
        </div>
      </div>
    </div>
  );
}
