import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({ children, className = '', spotlightColor = '#a855f7' }: SpotlightCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovering
            ? `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}15, transparent 80%)`
            : 'none',
        }}
      />
      <motion.div
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
