import React, { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const baseStyles =
  "font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[4.5rem]";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800 active:transform active:scale-[0.98]",
  secondary:
    "bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200 focus:ring-gray-400 active:bg-gray-300 active:transform active:scale-[0.98]",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 active:bg-red-800 active:transform active:scale-[0.98]",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400 active:bg-gray-100 active:transform active:scale-[0.98]",
  ghost:
    "text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-400 active:bg-gray-200 active:transform active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs px-2.5 py-1.5 gap-1",
  sm: "text-sm px-3 py-2 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-base px-6 py-3 gap-3",
};

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && "opacity-60 cursor-not-allowed pointer-events-none",
        fullWidth && "w-full",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
