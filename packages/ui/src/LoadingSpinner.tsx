import React from "react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: "ui-w-4 ui-h-4",
    md: "ui-w-8 ui-h-8",
    lg: "ui-w-12 ui-h-12",
  };

  const colorStyles = {
    primary: "ui-text-blue-600",
    white: "ui-text-white",
    gray: "ui-text-gray-400",
  };

  return (
    <div className={`${sizeStyles[size]} ${colorStyles[color]} ${className}`}>
      <svg
        className="ui-animate-spin ui-w-full ui-h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="ui-opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="ui-opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}
