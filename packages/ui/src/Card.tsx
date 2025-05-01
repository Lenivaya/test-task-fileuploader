import { ReactNode } from "react";
import clsx from "clsx";

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={clsx(
        "ui-bg-white ui-shadow-sm ui-rounded-lg ui-overflow-hidden ui-border ui-border-gray-100",
        hover &&
          "ui-transition-all ui-duration-200 hover:ui-shadow-md hover:ui-border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = "",
}: CardHeaderProps) {
  return (
    <div
      className={clsx(
        "ui-px-6 ui-py-5 ui-flex ui-justify-between ui-items-center ui-border-b ui-border-gray-100",
        className
      )}
    >
      <div>
        {title && (
          <h3 className="ui-text-xl ui-font-semibold ui-text-gray-800">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="ui-text-sm ui-text-gray-500 ui-mt-1.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="ui-ml-4 ui-flex-shrink-0">{action}</div>}
    </div>
  );
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={clsx("ui-p-6", className)}>{children}</div>;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={clsx(
        "ui-px-6 ui-py-4 ui-bg-gray-50 ui-border-t ui-border-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}
