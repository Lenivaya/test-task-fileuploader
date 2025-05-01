import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "ui-font-medium ui-rounded ui-transition-colors ui-focus:outline-none ui-focus:ring-2 ui-focus:ring-offset-2 ui-inline-flex ui-items-center ui-justify-center";

  const variantStyles = {
    primary:
      "ui-bg-blue-600 ui-text-white ui-hover:bg-blue-700 ui-focus:ring-blue-500",
    secondary:
      "ui-bg-gray-200 ui-text-gray-800 ui-hover:bg-gray-300 ui-focus:ring-gray-400",
    danger:
      "ui-bg-red-600 ui-text-white ui-hover:bg-red-700 ui-focus:ring-red-500",
    outline:
      "ui-border ui-border-gray-300 ui-bg-transparent ui-text-gray-700 ui-hover:bg-gray-50 ui-focus:ring-gray-400",
  };

  const sizeStyles = {
    sm: "ui-text-sm ui-px-3 ui-py-1",
    md: "ui-text-base ui-px-4 ui-py-2",
    lg: "ui-text-lg ui-px-5 ui-py-2.5",
  };

  const disabledStyles = "ui-opacity-60 ui-cursor-not-allowed";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || isLoading ? disabledStyles : ""} ${className}`}
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
