import React, { ChangeEvent, ReactNode, useCallback, useState } from 'react'
import clsx from 'clsx'
import humanFormat from 'human-format'

export interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  acceptedFileTypes?: string
  maxSizeInMB?: number
  children?: ReactNode
  className?: string
  disabled?: boolean
  isUploading?: boolean
  progress?: Record<string, number>
}

interface FileItemProps {
  file: File
  progress: number
  isUploading: boolean
  isComplete: boolean
  onRemove: () => void
}

interface DropzoneProps {
  isDragging: boolean
  isUploading: boolean
  disabled: boolean
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: () => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  formattedMaxSize: string
  maxFiles: number
  acceptedFileTypes?: string
  children?: ReactNode
}

interface ErrorMessageProps {
  message: string | null
}

function FileItem({
  file,
  progress,
  isUploading,
  isComplete,
  onRemove
}: FileItemProps) {
  return (
    <li className='relative flex items-center py-3 px-4 bg-white hover:bg-gray-50 transition-all duration-300 transform translate-y-0 hover:translate-y-0 opacity-100'>
      {isUploading && (
        <div
          className={clsx(
            'absolute inset-0 opacity-30 transition-all duration-300 ease-out',
            isComplete ? 'bg-green-50' : 'bg-blue-50'
          )}
          style={{ width: `${progress}%` }}
        />
      )}
      <div className='relative z-10 flex items-center w-full'>
        <div
          className={clsx(
            'w-10 h-10 flex-shrink-0 flex items-center justify-center rounded',
            isComplete
              ? 'bg-green-50 text-green-500'
              : 'bg-blue-50 text-blue-500'
          )}
        >
          {isComplete ? (
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          ) : (
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>
        <div className='ml-3 flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-900 truncate'>
            {file.name}
          </p>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-500'>
              {humanFormat.bytes(file.size, { separator: ' ' })} •{' '}
              {file.type || 'Unknown type'}
            </p>
            {isUploading && (
              <span
                className={clsx(
                  'text-xs font-medium',
                  isComplete ? 'text-green-500' : 'text-blue-500'
                )}
              >
                {isComplete ? 'Complete' : `${progress}%`}
              </span>
            )}
          </div>
        </div>
        {!isUploading && (
          <button
            type='button'
            onClick={onRemove}
            className='ml-4 p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors'
          >
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        )}
        {isUploading && !isComplete && (
          <div className='ml-4 w-5 h-5'>
            <svg
              className='w-5 h-5 animate-spin text-blue-500'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          </div>
        )}
      </div>
    </li>
  )
}

function FileList({
  files,
  isUploading,
  progress,
  onRemoveFile,
  onClearAll
}: {
  files: File[]
  isUploading: boolean
  progress: Record<string, number>
  onRemoveFile: (index: number) => void
  onClearAll: () => void
}) {
  if (files.length === 0) return null

  return (
    <div className='mt-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 ease-in-out'>
      <ul className='divide-y divide-gray-200'>
        {files.map((file, index) => {
          const fileProgress = progress[file.name] || 0
          const isComplete = fileProgress === 100

          return (
            <FileItem
              key={`${file.name}-${index}`}
              file={file}
              progress={fileProgress}
              isUploading={isUploading}
              isComplete={isComplete}
              onRemove={() => onRemoveFile(index)}
            />
          )
        })}
      </ul>
      {!isUploading && files.length > 1 && (
        <div className='px-4 py-3 bg-gray-50 border-t border-gray-200 text-right'>
          <button
            type='button'
            onClick={onClearAll}
            className='text-xs font-medium text-red-600 hover:text-red-800'
          >
            Clear all files
          </button>
        </div>
      )}
    </div>
  )
}

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className='flex items-center mt-3 text-sm text-red-600'>
      <svg
        className='w-4 h-4 mr-1.5 flex-shrink-0'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z'
          clipRule='evenodd'
        />
      </svg>
      {message}
    </div>
  )
}

function Dropzone({
  isDragging,
  isUploading,
  disabled,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  formattedMaxSize,
  maxFiles,
  acceptedFileTypes,
  children
}: DropzoneProps) {
  return (
    <div
      className={clsx(
        'border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center',
        {
          'border-blue-500 bg-blue-50 scale-[1.01] shadow-sm': isDragging,
          'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100':
            !isDragging,
          'opacity-60 cursor-not-allowed pointer-events-none':
            disabled || isUploading,
          'cursor-pointer': !disabled && !isUploading
        }
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type='file'
        id='fileInput'
        className='hidden'
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            const event = new CustomEvent('fileSelected', {
              detail: { files }
            })
            window.dispatchEvent(event)
          }
        }}
        multiple={maxFiles !== 1}
        accept={acceptedFileTypes}
        disabled={disabled || isUploading}
      />
      <label
        htmlFor='fileInput'
        className={clsx('flex flex-col items-center justify-center space-y-3', {
          'cursor-not-allowed': disabled || isUploading,
          'cursor-pointer': !disabled && !isUploading
        })}
      >
        {children || (
          <>
            <div className='w-16 h-16 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full mb-3'>
              {isUploading ? (
                <svg
                  className='w-8 h-8 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              ) : (
                <svg
                  className='w-8 h-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
              )}
            </div>
            <p className='text-sm font-medium text-gray-700'>
              {isUploading ? (
                'Uploading files...'
              ) : (
                <>
                  Drag files here or{' '}
                  <span className='text-blue-600 underline'>browse</span>
                </>
              )}
            </p>
            <p className='text-xs text-gray-500'>
              {maxFiles > 0 ? `Up to ${maxFiles} files` : 'Multiple files'}{' '}
              &bull; {formattedMaxSize} max
            </p>
          </>
        )}
      </label>
    </div>
  )
}

export function FileUploadZone({
  onFilesSelected,
  maxFiles = 0,
  acceptedFileTypes,
  maxSizeInMB = 10,
  children,
  className = '',
  disabled = false,
  isUploading = false,
  progress = {}
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  const formattedMaxSize = humanFormat.bytes(maxSizeInBytes, {
    separator: ' '
  })

  const validateAndProcessFiles = useCallback(
    (fileList: FileList) => {
      setError(null)
      const newFilesToUpload = Array.from(fileList)
      const combinedFiles = [...selectedFiles, ...newFilesToUpload]

      if (maxFiles > 0 && combinedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const oversizedFiles = newFilesToUpload.filter(
        (file) => file.size > maxSizeInBytes
      )
      if (oversizedFiles.length > 0) {
        setError(`File size exceeds ${formattedMaxSize} limit`)
        return
      }

      setSelectedFiles(combinedFiles)
      setTimeout(() => {
        onFilesSelected(newFilesToUpload)
      }, 0)
    },
    [maxFiles, maxSizeInBytes, formattedMaxSize, onFilesSelected, selectedFiles]
  )

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files)
    }
  }

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled || isUploading) return

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndProcessFiles(e.dataTransfer.files)
      }
    },
    [disabled, isUploading, validateAndProcessFiles]
  )

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const updated = [...prev]
        updated.splice(index, 1)
        setTimeout(() => {
          onFilesSelected(updated)
        }, 0)
        return updated
      })
    },
    [onFilesSelected]
  )

  const clearAllFiles = useCallback(() => {
    setSelectedFiles([])
    onFilesSelected([])
  }, [onFilesSelected])

  // Add event listener for file input
  React.useEffect(() => {
    const handleFileSelected = (event: any) => {
      const { files } = event.detail
      validateAndProcessFiles(files)
    }

    window.addEventListener('fileSelected', handleFileSelected as EventListener)
    return () => {
      window.removeEventListener(
        'fileSelected',
        handleFileSelected as EventListener
      )
    }
  }, [validateAndProcessFiles])

  return (
    <div className={clsx('w-full', className)}>
      <Dropzone
        isDragging={isDragging}
        isUploading={isUploading}
        disabled={disabled}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        formattedMaxSize={formattedMaxSize}
        maxFiles={maxFiles}
        acceptedFileTypes={acceptedFileTypes}
        children={children}
      />

      <ErrorMessage message={error} />

      <FileList
        files={selectedFiles}
        isUploading={isUploading}
        progress={progress}
        onRemoveFile={removeFile}
        onClearAll={clearAllFiles}
      />
    </div>
  )
}
