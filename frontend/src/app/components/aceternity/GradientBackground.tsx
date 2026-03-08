import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animated?: boolean;
}

export function GradientBackground({
  children,
  className = '',
  colors = ['#a855f7', '#f59e0b', '#7c7c3b'],
  animated = true,
}: GradientBackgroundProps) {
  if (!animated) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, ${colors.join(', ')})`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, ${colors.join(', ')})`,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          backgroundSize: ['200% 200%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: `linear-gradient(45deg, ${colors.reverse().join(', ')})`,
        }}
        animate={{
          backgroundPosition: ['100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
