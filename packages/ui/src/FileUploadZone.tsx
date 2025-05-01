import { ChangeEvent, ReactNode, useCallback, useState } from "react";

export interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FileUploadZone({
  onFilesSelected,
  maxFiles = 0, // 0 means unlimited
  acceptedFileTypes,
  maxSizeInMB = 10,
  children,
  className = "",
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const validateAndProcessFiles = useCallback(
    (fileList: FileList) => {
      setError(null);
      let filesToUpload = Array.from(fileList);

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
        setError(`File size exceeds ${maxSizeInMB}MB limit`);
        return;
      }

      onFilesSelected(filesToUpload);
    },
    [maxFiles, maxSizeInBytes, maxSizeInMB, onFilesSelected]
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

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndProcessFiles(e.dataTransfer.files);
      }
    },
    [disabled, validateAndProcessFiles]
  );

  return (
    <div className={`ui-w-full ${className}`}>
      <div
        className={`ui-border-2 ui-border-dashed ui-rounded-lg ui-p-8 ui-transition-all ui-duration-200 ui-text-center ${
          isDragging
            ? "ui-border-blue-500 ui-bg-blue-50 ui-scale-[1.01] ui-shadow-sm"
            : "ui-border-gray-300 ui-bg-gray-50 hover:ui-border-gray-400 hover:ui-bg-gray-100"
        } ${disabled ? "ui-opacity-60 ui-cursor-not-allowed ui-pointer-events-none" : "ui-cursor-pointer"}`}
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
          disabled={disabled}
        />
        <label
          htmlFor="fileInput"
          className={`ui-flex ui-flex-col ui-items-center ui-justify-center ui-space-y-3 ${
            disabled ? "ui-cursor-not-allowed" : "ui-cursor-pointer"
          }`}
        >
          {children || (
            <>
              <div className="ui-w-14 ui-h-14 ui-flex ui-items-center ui-justify-center ui-bg-blue-50 ui-text-blue-600 ui-rounded-full ui-mb-2">
                <svg
                  className="ui-w-7 ui-h-7"
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
              </div>
              <p className="ui-text-sm ui-font-medium ui-text-gray-700">
                Drag files here or{" "}
                <span className="ui-text-blue-600 ui-underline">browse</span>
              </p>
              <p className="ui-text-xs ui-text-gray-500">
                {maxFiles > 0 ? `Up to ${maxFiles} files` : "Multiple files"}{" "}
                &bull; {maxSizeInMB}MB max
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
    </div>
  );
}
