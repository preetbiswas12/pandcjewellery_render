import { NoiseBackground } from "@/components/ui/noise-background";
import { ReactNode } from "react";

interface NoiseButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  gradientColors?: string[];
  containerClassName?: string;
}

export const NoiseButton = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  gradientColors = [
    "rgb(255, 100, 150)",
    "rgb(100, 150, 255)",
    "rgb(255, 200, 100)",
  ],
  containerClassName = "w-fit",
}: NoiseButtonProps) => {
  return (
    <NoiseBackground
      containerClassName={`p-2 rounded-full ${containerClassName}`}
      gradientColors={gradientColors}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-6 py-2 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] disabled:opacity-50 disabled:cursor-not-allowed font-medium ${className}`}
      >
        {children}
      </button>
    </NoiseBackground>
  );
};
