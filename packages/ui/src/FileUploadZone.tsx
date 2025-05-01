import { ChangeEvent, ReactNode, useCallback, useState } from "react";
import clsx from "clsx";
import humanFormat from "human-format";

export interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  isUploading?: boolean;
  progress?: Record<string, number>;
}

export function FileUploadZone({
  onFilesSelected,
  maxFiles = 0, // 0 means unlimited
  acceptedFileTypes,
  maxSizeInMB = 10,
  children,
  className = "",
  disabled = false,
  isUploading = false,
  progress = {},
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  const formattedMaxSize = humanFormat.bytes(maxSizeInBytes, {
    separator: " ",
  });

  const validateAndProcessFiles = useCallback(
    (fileList: FileList) => {
      setError(null);
      const filesToUpload = Array.from(fileList);

      // Validate number of files
      if (maxFiles > 0 && filesToUpload.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate file size
      const oversizedFiles = filesToUpload.filter(
        (file) => file.size > maxSizeInBytes
      );
      if (oversizedFiles.length > 0) {
        setError(`File size exceeds ${formattedMaxSize} limit`);
        return;
      }

      setSelectedFiles(filesToUpload);
      onFilesSelected(filesToUpload);
    },
    [maxFiles, maxSizeInBytes, formattedMaxSize, onFilesSelected]
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndProcessFiles(e.dataTransfer.files);
      }
    },
    [disabled, isUploading, validateAndProcessFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        onFilesSelected(updated);
        return updated;
      });
    },
    [onFilesSelected]
  );

  return (
    <div className={clsx("ui-w-full", className)}>
      <div
        className={clsx(
          "ui-border-2 ui-border-dashed ui-rounded-lg ui-p-6 ui-transition-all ui-duration-200 ui-text-center",
          {
            "ui-border-blue-500 ui-bg-blue-50 ui-scale-[1.01] ui-shadow-sm":
              isDragging,
            "ui-border-gray-300 ui-bg-gray-50 hover:ui-border-gray-400 hover:ui-bg-gray-100":
              !isDragging,
            "ui-opacity-60 ui-cursor-not-allowed ui-pointer-events-none":
              disabled || isUploading,
            "ui-cursor-pointer": !disabled && !isUploading,
          }
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className="ui-hidden"
          onChange={handleFileChange}
          multiple={maxFiles !== 1}
          accept={acceptedFileTypes}
          disabled={disabled || isUploading}
        />
        <label
          htmlFor="fileInput"
          className={clsx(
            "ui-flex ui-flex-col ui-items-center ui-justify-center ui-space-y-3",
            {
              "ui-cursor-not-allowed": disabled || isUploading,
              "ui-cursor-pointer": !disabled && !isUploading,
            }
          )}
        >
          {children || (
            <>
              <div className="ui-w-16 ui-h-16 ui-flex ui-items-center ui-justify-center ui-bg-blue-50 ui-text-blue-600 ui-rounded-full ui-mb-3">
                {isUploading ? (
                  <svg
                    className="ui-w-8 ui-h-8 ui-animate-spin"
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
                ) : (
                  <svg
                    className="ui-w-8 ui-h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                )}
              </div>
              <p className="ui-text-sm ui-font-medium ui-text-gray-700">
                {isUploading ? (
                  "Uploading files..."
                ) : (
                  <>
                    Drag files here or{" "}
                    <span className="ui-text-blue-600 ui-underline">
                      browse
                    </span>
                  </>
                )}
              </p>
              <p className="ui-text-xs ui-text-gray-500">
                {maxFiles > 0 ? `Up to ${maxFiles} files` : "Multiple files"}{" "}
                &bull; {formattedMaxSize} max
              </p>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="ui-flex ui-items-center ui-mt-3 ui-text-sm ui-text-red-600">
          <svg
            className="ui-w-4 ui-h-4 ui-mr-1.5 ui-flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="ui-mt-4 ui-bg-white ui-border ui-border-gray-200 ui-rounded-lg ui-shadow-sm ui-overflow-hidden ui-transition-all ui-duration-300 ui-ease-in-out">
          <ul className="ui-divide-y ui-divide-gray-200">
            {selectedFiles.map((file, index) => {
              const fileProgress = progress[file.name] || 0;
              const isComplete = fileProgress === 100;

              return (
                <li
                  key={`${file.name}-${index}`}
                  className="ui-relative ui-flex ui-items-center ui-py-3 ui-px-4 ui-bg-white ui-hover:bg-gray-50 ui-transition-all ui-duration-300 ui-transform ui-translate-y-0 hover:ui-translate-y-0 ui-opacity-100"
                >
                  {isUploading && (
                    <div
                      className={clsx(
                        "ui-absolute ui-inset-0 ui-opacity-30 ui-transition-all ui-duration-300 ui-ease-out",
                        isComplete ? "ui-bg-green-50" : "ui-bg-blue-50"
                      )}
                      style={{ width: `${fileProgress}%` }}
                    />
                  )}
                  <div className="ui-relative ui-z-10 ui-flex ui-items-center ui-w-full">
                    <div
                      className={clsx(
                        "ui-w-10 ui-h-10 ui-flex-shrink-0 ui-flex ui-items-center ui-justify-center ui-rounded",
                        isComplete
                          ? "ui-bg-green-50 ui-text-green-500"
                          : "ui-bg-blue-50 ui-text-blue-500"
                      )}
                    >
                      {isComplete ? (
                        <svg
                          className="ui-w-5 ui-h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="ui-w-5 ui-h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ui-ml-3 ui-flex-1 ui-min-w-0">
                      <p className="ui-text-sm ui-font-medium ui-text-gray-900 ui-truncate">
                        {file.name}
                      </p>
                      <div className="ui-flex ui-items-center ui-justify-between">
                        <p className="ui-text-xs ui-text-gray-500">
                          {humanFormat.bytes(file.size, { separator: " " })} •{" "}
                          {file.type || "Unknown type"}
                        </p>
                        {isUploading && (
                          <span
                            className={clsx(
                              "ui-text-xs ui-font-medium",
                              isComplete
                                ? "ui-text-green-500"
                                : "ui-text-blue-500"
                            )}
                          >
                            {isComplete ? "Complete" : `${fileProgress}%`}
                          </span>
                        )}
                      </div>
                    </div>
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ui-ml-4 ui-p-1 ui-rounded-full ui-text-gray-400 ui-hover:text-red-500 ui-transition-colors"
                      >
                        <svg
                          className="ui-w-5 ui-h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                    {isUploading && !isComplete && (
                      <div className="ui-ml-4 ui-w-5 ui-h-5">
                        <svg
                          className="ui-w-5 ui-h-5 ui-animate-spin ui-text-blue-500"
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
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {!isUploading && selectedFiles.length > 1 && (
            <div className="ui-px-4 ui-py-3 ui-bg-gray-50 ui-border-t ui-border-gray-200 ui-text-right">
              <button
                type="button"
                onClick={() => {
                  setSelectedFiles([]);
                  onFilesSelected([]);
                }}
                className="ui-text-xs ui-font-medium ui-text-red-600 ui-hover:text-red-800"
              >
                Clear all files
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
