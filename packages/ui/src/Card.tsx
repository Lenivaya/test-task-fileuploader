import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`ui-bg-white ui-shadow-md ui-rounded-lg ui-overflow-hidden ui-border ui-border-gray-100 ${className}`}
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
      className={`ui-px-6 ui-py-4 ui-flex ui-justify-between ui-items-center ui-border-b ui-border-gray-100 ${className}`}
    >
      <div>
        {title && (
          <h3 className="ui-text-xl ui-font-semibold ui-text-gray-800">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="ui-text-sm ui-text-gray-500 ui-mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`ui-p-6 ${className}`}>{children}</div>;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={`ui-px-6 ui-py-4 ui-bg-gray-50 ui-border-t ui-border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}
