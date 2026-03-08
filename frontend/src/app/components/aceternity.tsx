import React from 'react';
import { motion } from 'framer-motion';
import { ReactNode, CSSProperties } from 'react';

/**
 * SpotlightCard - Card with animated spotlight effect
 */
interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({ 
  children, 
  className = '', 
  spotlightColor = 'magenta' 
}: SpotlightCardProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const spotlightStyle: CSSProperties = {
    background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15) 0%, transparent 80%)`,
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    transition: 'background 0.1s ease-out',
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div style={spotlightStyle} />
      {children}
    </motion.div>
  );
}

/**
 * AnimatedText - Text with stagger animation
 */
interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ 
  children, 
  className = '', 
  delay = 0 
}: AnimatedTextProps) {
  const words = children.split(' ');

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.1,
            ease: 'easeOut'
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

/**
 * StaggerContainer - Container with stagger animation for children
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayChildren
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * GradientButton - Button with animated gradient effect
 */
interface GradientButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function GradientButton({
  children,
  className = '',
  onClick,
  href
}: GradientButtonProps) {
  const Component = href ? 'a' : 'button';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-block"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-magenta-600 via-purple-600 to-golden-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
      <Component
        href={href}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-magenta-600 to-magenta-500 rounded-full transition-all duration-200 ${className}`}
      >
        {children}
      </Component>
    </motion.div>
  );
}

/**
 * ShimmerButton - Button with shimmer effect
 */
interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ShimmerButton({
  children,
  className = '',
  onClick
}: ShimmerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative group overflow-hidden px-8 py-3 rounded-full font-bold text-white ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-magenta-600 via-purple-600 to-golden-500 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500" />
      <div className="relative inline-block">{children}</div>
    </motion.button>
  );
}

/**
 * HoverBorderGradient - Container with animated gradient border on hover
 */
interface HoverBorderGradientProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function HoverBorderGradient({
  children,
  className = '',
  duration = 3
}: HoverBorderGradientProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-magenta-600 via-purple-500 to-golden-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
      <motion.div
        className="relative bg-white dark:bg-gray-950 rounded-lg p-6"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(245,158,11,0.1))'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * AnimatedBackground - Background with animated gradient
 */
interface AnimatedBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedBackground({
  children,
  className = ''
}: AnimatedBackgroundProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      animate={{
        background: [
          'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(245,158,11,0.05))',
          'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(168,85,247,0.05))',
          'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(245,158,11,0.05))',
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * FloatingCard - Card with floating animation
 */
interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FloatingCard({
  children,
  className = '',
  delay = 0,
  duration = 6
}: FloatingCardProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -20, 0] }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * PulseGlow - Element with pulsing glow effect
 */
interface PulseGlowProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function PulseGlow({
  children,
  className = '',
  glowColor = 'magenta'
}: PulseGlowProps) {
  const glowColorMap = {
    magenta: 'shadow-magenta-500/50',
    golden: 'shadow-golden-500/50',
    olive: 'shadow-olive-500/30'
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 20px rgba(168, 85, 247, 0.3)`,
          `0 0 40px rgba(168, 85, 247, 0.5)`,
          `0 0 20px rgba(168, 85, 247, 0.3)`
        ]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * SwipeReveal - Text reveal on scroll with swipe animation
 */
interface SwipeRevealProps {
  children: ReactNode;
  className?: string;
}

export function SwipeReveal({
  children,
  className = ''
}: SwipeRevealProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div
        initial={{ x: -100 }}
        whileInView={{ x: 100 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
      />
      {children}
    </motion.div>
  );
}
