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
        className={`ui-border-2 ui-border-dashed ui-rounded-lg ui-p-6 ui-transition-colors ui-text-center ${
          isDragging
            ? "ui-border-blue-500 ui-bg-blue-50"
            : "ui-border-gray-300 ui-bg-gray-50"
        } ${disabled ? "ui-opacity-60 ui-cursor-not-allowed" : "ui-cursor-pointer"}`}
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
          className={`ui-flex ui-flex-col ui-items-center ui-justify-center ui-space-y-2 ${
            disabled ? "ui-cursor-not-allowed" : "ui-cursor-pointer"
          }`}
        >
          {children || (
            <>
              <svg
                className="ui-w-10 ui-h-10 ui-text-gray-400"
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
              <p className="ui-text-sm ui-text-gray-600">
                Drag files here or{" "}
                <span className="ui-text-blue-600 ui-font-medium">browse</span>
              </p>
              <p className="ui-text-xs ui-text-gray-500">
                {maxFiles > 0 ? `Up to ${maxFiles} files` : "Multiple files"}{" "}
                &bull; {maxSizeInMB}MB max
              </p>
            </>
          )}
        </label>
      </div>
      {error && <p className="ui-text-sm ui-text-red-500 ui-mt-2">{error}</p>}
    </div>
  );
}
