import { ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  rounded = false,
  className = "",
}: BadgeProps) {
  const variantStyles = {
    default: "ui-bg-gray-100 ui-text-gray-800",
    primary: "ui-bg-blue-100 ui-text-blue-800",
    success: "ui-bg-green-100 ui-text-green-800",
    warning: "ui-bg-yellow-100 ui-text-yellow-800",
    danger: "ui-bg-red-100 ui-text-red-800",
    info: "ui-bg-indigo-100 ui-text-indigo-800",
  };

  const sizeStyles = {
    sm: "ui-text-xs ui-px-1.5 ui-py-0.5",
    md: "ui-text-xs ui-px-2 ui-py-1",
    lg: "ui-text-sm ui-px-2.5 ui-py-1.5",
  };

  const roundedStyles = rounded ? "ui-rounded-full" : "ui-rounded";

  return (
    <span
      className={`ui-inline-flex ui-items-center ui-font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles} ${className}`}
    >
      {children}
    </span>
  );
}
