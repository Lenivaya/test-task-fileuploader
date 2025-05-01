import { ReactNode } from "react";
import clsx from "clsx";

export interface CardProps {
  children?: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
}: CardProps) {
  const cardClasses = clsx(
    "bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100",
    hoverable && "cursor-pointer",
    hoverable &&
      "transition-all duration-200 hover:shadow-md hover:border-gray-200",
    className
  );

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = "",
}: CardHeaderProps) {
  if (!title && !subtitle && !action) return null;

  return (
    <div
      className={clsx(
        "px-6 py-5 flex justify-between items-center border-b border-gray-100",
        className
      )}
    >
      <div>
        {title && (
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        )}
        {subtitle && <p className="text-sm text-gray-500 mt-1.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export interface CardContentProps {
  children?: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={clsx("p-6", className)}>{children}</div>;
}

export interface CardFooterProps {
  children?: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={clsx(
        "px-6 py-4 bg-gray-50 border-t border-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}
