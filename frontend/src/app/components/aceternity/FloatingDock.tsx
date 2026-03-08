import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Heart, User, Settings, LogOut } from 'lucide-react';

interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingDockProps {
  items: DockItem[];
}

export function FloatingDock({ items }: FloatingDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Glow background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-magenta-600/20 to-golden-500/20 blur-3xl" />

        {/* Dock container */}
        <motion.div
          className="relative flex items-center gap-3 px-6 py-4 rounded-full bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl"
          layout
        >
          {items.map((item, index) => (
            <motion.button
              key={index}
              onClick={item.onClick}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.2, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-12 h-12 rounded-full text-gray-800 hover:text-magenta-600 transition-colors"
            >
              {/* Hover background */}
              {hoveredIndex === index && (
                <motion.div
                  layoutId="dock-highlight"
                  className="absolute inset-0 bg-gray-100 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Icon */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: hoveredIndex === index ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
              </motion.div>

              {/* Tooltip */}
              {hoveredIndex === index && (
                <motion.div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="px-3 py-1 rounded-lg bg-gray-900 text-white text-xs font-medium">
                    {item.label}
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
