import { ReactNode } from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'
import humanFormat from 'human-format'
import { FileThumbnail } from './FileThumbnail'

export interface FileCardProps {
  fileName: string
  fileType?: string
  fileSize?: number
  uploadDate?: Date | string
  thumbnailUrl?: string
  actions?: ReactNode
  className?: string
  onClick?: () => void
}

export function FileCard({
  fileName,
  fileType,
  fileSize,
  uploadDate,
  thumbnailUrl,
  actions,
  className = '',
  onClick
}: FileCardProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    return humanFormat.bytes(bytes, { separator: ' ' })
  }

  const formatDate = (date?: Date | string) => {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return 'Invalid date'
    return format(d, 'MMM d, yyyy')
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200',
        'flex items-center p-4 gap-4 transition-all duration-200',
        onClick &&
          'cursor-pointer hover:bg-gray-50 hover:shadow-md hover:border-gray-300 active:transform active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      <div className='flex-shrink-0'>
        <FileThumbnail
          fileName={fileName}
          fileType={fileType}
          thumbnailUrl={thumbnailUrl}
        />
      </div>

      <div className='flex-1 min-w-0'>
        <h3 className='text-sm font-medium text-gray-900 truncate'>
          {fileName}
        </h3>
        <div className='flex flex-wrap items-center text-xs text-gray-500 mt-1.5 gap-1.5'>
          {fileType && (
            <span className='truncate bg-gray-100 text-gray-700 rounded-full px-2 py-0.5'>
              {fileType}
            </span>
          )}
          {fileSize !== undefined && (
            <span className='whitespace-nowrap'>
              {formatFileSize(fileSize)}
            </span>
          )}
          {uploadDate && (
            <span className='whitespace-nowrap text-gray-400'>
              {formatDate(uploadDate)}
            </span>
          )}
        </div>
      </div>

      {actions && (
        <div className='flex-shrink-0 ml-auto flex items-center gap-2'>
          {actions}
        </div>
      )}
    </div>
  )
}
