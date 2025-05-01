import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "ui-font-medium ui-rounded-md ui-transition-all ui-duration-200 ui-inline-flex ui-items-center ui-justify-center ui-focus:outline-none ui-focus:ring-2 ui-focus:ring-offset-2 ui-min-w-[4.5rem]";

  const variantStyles = {
    primary:
      "ui-bg-blue-600 ui-text-white ui-shadow-sm hover:ui-bg-blue-700 ui-focus:ring-blue-500 active:ui-bg-blue-800 active:ui-transform active:ui-scale-[0.98]",
    secondary:
      "ui-bg-gray-100 ui-text-gray-800 ui-shadow-sm hover:ui-bg-gray-200 ui-focus:ring-gray-400 active:ui-bg-gray-300 active:ui-transform active:ui-scale-[0.98]",
    danger:
      "ui-bg-red-600 ui-text-white ui-shadow-sm hover:ui-bg-red-700 ui-focus:ring-red-500 active:ui-bg-red-800 active:ui-transform active:ui-scale-[0.98]",
    outline:
      "ui-border ui-border-gray-300 ui-bg-white ui-text-gray-700 hover:ui-bg-gray-50 ui-focus:ring-gray-400 active:ui-bg-gray-100 active:ui-transform active:ui-scale-[0.98]",
    ghost:
      "ui-text-gray-700 ui-bg-transparent hover:ui-bg-gray-100 ui-focus:ring-gray-400 active:ui-bg-gray-200 active:ui-transform active:ui-scale-[0.98]",
  };

  const sizeStyles = {
    xs: "ui-text-xs ui-px-2.5 ui-py-1 ui-gap-1",
    sm: "ui-text-sm ui-px-3.5 ui-py-1.5 ui-gap-1.5",
    md: "ui-text-sm ui-px-4 ui-py-2 ui-gap-2",
    lg: "ui-text-base ui-px-5 ui-py-2.5 ui-gap-2",
  };

  const disabledStyles =
    "ui-opacity-60 ui-cursor-not-allowed ui-pointer-events-none ui-shadow-none";
  const widthStyles = fullWidth ? "ui-w-full" : "";

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        (disabled || isLoading) && disabledStyles,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="ui-mr-2">
          <svg
            className="ui-animate-spin ui-h-4 ui-w-4 ui-text-current"
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
        </span>
      ) : null}
      {children}
    </button>
  );
}
