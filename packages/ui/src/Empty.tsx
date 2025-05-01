import { ReactNode } from "react";

export interface EmptyProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Empty({
  title = "No data",
  description = "No items to display at the moment.",
  icon,
  action,
  className = "",
}: EmptyProps) {
  return (
    <div
      className={`ui-flex ui-flex-col ui-items-center ui-justify-center ui-text-center ui-py-10 ui-px-4 ${className}`}
    >
      {icon || (
        <svg
          className="ui-h-16 ui-w-16 ui-text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      <h3 className="ui-mt-4 ui-text-lg ui-font-medium ui-text-gray-900">
        {title}
      </h3>
      {description && (
        <p className="ui-mt-1 ui-text-sm ui-text-gray-500">{description}</p>
      )}
      {action && <div className="ui-mt-6">{action}</div>}
    </div>
  );
}
