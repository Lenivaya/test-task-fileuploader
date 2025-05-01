import { ReactNode } from "react";

export type ProgressBarSize = "sm" | "md" | "lg";
export type ProgressBarVariant = "default" | "success" | "warning" | "danger";

export interface ProgressBarProps {
  progress: number;
  max?: number;
  size?: ProgressBarSize;
  variant?: ProgressBarVariant;
  showPercentage?: boolean;
  label?: ReactNode;
  className?: string;
}

export function ProgressBar({
  progress,
  max = 100,
  size = "md",
  variant = "default",
  showPercentage = false,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(0, (progress / max) * 100), 100);

  const sizeStyles = {
    sm: "ui-h-1",
    md: "ui-h-2",
    lg: "ui-h-3",
  };

  const variantStyles = {
    default: "ui-bg-blue-500",
    success: "ui-bg-green-500",
    warning: "ui-bg-yellow-500",
    danger: "ui-bg-red-500",
  };

  const getLabelColor = () => {
    switch (variant) {
      case "default":
        return "ui-text-blue-700";
      case "success":
        return "ui-text-green-700";
      case "warning":
        return "ui-text-yellow-700";
      case "danger":
        return "ui-text-red-700";
      default:
        return "ui-text-gray-700";
    }
  };

  return (
    <div className={`ui-w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="ui-flex ui-justify-between ui-items-center ui-mb-1">
          {label && (
            <div className={`ui-text-sm ${getLabelColor()}`}>{label}</div>
          )}
          {showPercentage && (
            <div className="ui-text-xs ui-font-medium ui-text-gray-500">
              {percentage.toFixed(1)}%
            </div>
          )}
        </div>
      )}

      <div
        className={`ui-w-full ui-bg-gray-200 ui-rounded-full ${sizeStyles[size]}`}
      >
        <div
          className={`${variantStyles[variant]} ui-rounded-full ${sizeStyles[size]} ui-transition-all ui-duration-300 ui-ease-in-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={max}
        ></div>
      </div>
    </div>
  );
}
