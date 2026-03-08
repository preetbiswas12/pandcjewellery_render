import { ButtonHTMLAttributes, ReactNode } from 'react';
import { NoiseBackground } from '@/components/ui/noise-background';
import { cn } from '@/lib/utils';

interface NoisePrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  containerClassName?: string;
  gradientColors?: string[];
}

export const NoisePrimaryButton = ({
  children,
  className,
  containerClassName,
  gradientColors = [
    'rgb(236, 72, 153)',   // Pink
    'rgb(59, 130, 246)',   // Blue
    'rgb(249, 115, 22)'    // Orange
  ],
  ...props
}: NoisePrimaryButtonProps) => {
  return (
    <div className={cn('relative inline-block', containerClassName)}>
      <NoiseBackground
        gradientColors={gradientColors}
        speed={0.5}
        noiseIntensity={0.6}
      />
      <button
        className={cn(
          'relative px-8 py-3 rounded-full font-medium text-white',
          'hover:brightness-110 transition-all duration-200',
          'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};
