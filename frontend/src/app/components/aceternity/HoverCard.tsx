import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
}

export function HoverCard({ children, className = '' }: HoverCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-gradient-to-r from-magenta-500/20 via-transparent to-golden-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
        }}
      />
      {children}
    </motion.div>
  );
}
