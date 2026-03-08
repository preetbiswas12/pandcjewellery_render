import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBadgeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedBadge({ children, className = '', delay = 0 }: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
