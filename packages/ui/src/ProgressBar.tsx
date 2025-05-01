import { HTMLAttributes } from "react";

export type ProgressBarVariant = "default" | "success" | "warning" | "danger";
export type ProgressBarSize = "xs" | "sm" | "md" | "lg";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  progress: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  showPercentage?: boolean;
  animate?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  variant = "default",
  size = "md",
  showPercentage = false,
  animate = true,
  className = "",
  ...props
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress));

  // Format percentage for display
  const formattedProgress = `${Math.round(normalizedProgress)}%`;

  const variantStyles = {
    default: {
      bar: "ui-bg-blue-500",
      track: "ui-bg-blue-100",
      text: "ui-text-blue-800",
    },
    success: {
      bar: "ui-bg-green-500",
      track: "ui-bg-green-100",
      text: "ui-text-green-800",
    },
    warning: {
      bar: "ui-bg-amber-500",
      track: "ui-bg-amber-100",
      text: "ui-text-amber-800",
    },
    danger: {
      bar: "ui-bg-red-500",
      track: "ui-bg-red-100",
      text: "ui-text-red-800",
    },
  };

  const sizeStyles = {
    xs: "ui-h-1",
    sm: "ui-h-1.5",
    md: "ui-h-2.5",
    lg: "ui-h-4",
  };

  const textSizeStyles = {
    xs: "ui-text-xs",
    sm: "ui-text-xs",
    md: "ui-text-sm",
    lg: "ui-text-sm",
  };

  return (
    <div className={`ui-w-full ${className}`} {...props}>
      <div className="ui-flex ui-items-center ui-gap-3">
        <div
          className={`ui-flex-1 ui-overflow-hidden ui-rounded-full ${variantStyles[variant].track}`}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`${sizeStyles[size]} ${variantStyles[variant].bar} ui-rounded-full ui-transition-all ui-duration-300 ui-ease-out ${animate ? "ui-animate-pulse" : ""}`}
            style={{ width: `${normalizedProgress}%` }}
          />
        </div>

        {showPercentage && (
          <div
            className={`ui-flex-shrink-0 ${textSizeStyles[size]} ui-font-medium ${variantStyles[variant].text}`}
          >
            {formattedProgress}
          </div>
        )}
      </div>
    </div>
  );
}
