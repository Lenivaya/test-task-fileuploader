import { ReactNode } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import { FileThumbnail } from "./FileThumbnail";

export interface FileCardProps {
  fileName: string;
  fileType?: string;
  fileSize?: number;
  uploadDate?: Date | string;
  thumbnailUrl?: string;
  actions?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function FileCard({
  fileName,
  fileType,
  fileSize,
  uploadDate,
  thumbnailUrl,
  actions,
  className = "",
  onClick,
}: FileCardProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    try {
      return format(dateObj, "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div
      className={clsx(
        "ui-bg-white ui-rounded-lg ui-shadow-sm ui-overflow-hidden ui-border ui-border-gray-200",
        "ui-flex ui-items-center ui-p-4 ui-gap-4 ui-transition-all ui-duration-200",
        onClick &&
          "ui-cursor-pointer hover:ui-bg-gray-50 hover:ui-shadow-md hover:ui-border-gray-300 active:ui-transform active:ui-scale-[0.99]",
        className
      )}
      onClick={onClick}
    >
      <div className="ui-flex-shrink-0">
        <FileThumbnail
          fileName={fileName}
          fileType={fileType}
          thumbnailUrl={thumbnailUrl}
        />
      </div>

      <div className="ui-flex-1 ui-min-w-0">
        <h3 className="ui-text-sm ui-font-medium ui-text-gray-900 ui-truncate">
          {fileName}
        </h3>
        <div className="ui-flex ui-flex-wrap ui-items-center ui-text-xs ui-text-gray-500 ui-mt-1.5 ui-gap-1.5">
          {fileType && (
            <span className="ui-truncate ui-bg-gray-100 ui-text-gray-700 ui-rounded-full ui-px-2 ui-py-0.5">
              {fileType}
            </span>
          )}
          {fileSize !== undefined && (
            <span className="ui-whitespace-nowrap">
              {formatFileSize(fileSize)}
            </span>
          )}
          {uploadDate && (
            <span className="ui-whitespace-nowrap ui-text-gray-400">
              {formatDate(uploadDate)}
            </span>
          )}
        </div>
      </div>

      {actions && (
        <div className="ui-flex-shrink-0 ui-ml-auto ui-flex ui-items-center ui-gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
