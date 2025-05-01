import { HTMLAttributes, ReactNode } from "react";

export type ProgressVariant = "primary" | "success" | "warning" | "danger";
export type ProgressSize = "xs" | "sm" | "md" | "lg";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  labelFormat?: (value: number, max: number) => ReactNode;
  animate?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  showLabel = true,
  labelFormat,
  animate = false,
  className = "",
  ...props
}: ProgressBarProps) {
  // Ensure value is between 0 and max
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;

  // Define styles for different variants
  const variantStyles = {
    primary: {
      bar: "bg-blue-500",
      track: "bg-blue-100",
      text: "text-blue-800",
    },
    success: {
      bar: "bg-green-500",
      track: "bg-green-100",
      text: "text-green-800",
    },
    warning: {
      bar: "bg-amber-500",
      track: "bg-amber-100",
      text: "text-amber-800",
    },
    danger: {
      bar: "bg-red-500",
      track: "bg-red-100",
      text: "text-red-800",
    },
  };

  // Define size styles
  const sizeStyles = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  // Define text size styles based on progress bar size
  const textSizeStyles = {
    xs: "text-xs",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex items-center gap-3">
        <div
          className={`flex-1 overflow-hidden rounded-full ${variantStyles[variant].track}`}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={`${sizeStyles[size]} ${variantStyles[variant].bar} rounded-full transition-all duration-300 ease-out ${animate ? "animate-pulse" : ""}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {showLabel && (
          <span
            className={`flex-shrink-0 ${textSizeStyles[size]} font-medium ${variantStyles[variant].text}`}
          >
            {labelFormat
              ? labelFormat(clampedValue, max)
              : `${Math.round(percentage)}%`}
          </span>
        )}
      </div>
    </div>
  );
}
