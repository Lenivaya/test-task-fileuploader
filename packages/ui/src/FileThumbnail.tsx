import React from 'react'

export interface FileThumbnailProps {
  fileName: string
  fileType?: string
  thumbnailUrl?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

interface IconProps {
  className: string
}

function ImageIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
      <circle cx='8.5' cy='8.5' r='1.5'></circle>
      <polyline points='21 15 16 10 5 21'></polyline>
    </svg>
  )
}

function DocumentIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
      <polyline points='14 2 14 8 20 8'></polyline>
      <line x1='16' y1='13' x2='8' y2='13'></line>
      <line x1='16' y1='17' x2='8' y2='17'></line>
      <line x1='10' y1='9' x2='8' y2='9'></line>
    </svg>
  )
}

function SpreadsheetIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
      <polyline points='14 2 14 8 20 8'></polyline>
      <line x1='16' y1='13' x2='8' y2='13'></line>
      <line x1='16' y1='17' x2='8' y2='17'></line>
      <polyline points='10 9 9 9 8 9'></polyline>
    </svg>
  )
}

function PresentationIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M2 3h20v14H2z'></path>
      <path d='M12 17v4'></path>
      <path d='M8 21h8'></path>
    </svg>
  )
}

function VideoIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='2' y='2' width='20' height='20' rx='2.18' ry='2.18'></rect>
      <line x1='7' y1='2' x2='7' y2='22'></line>
      <line x1='17' y1='2' x2='17' y2='22'></line>
      <line x1='2' y1='12' x2='22' y2='12'></line>
      <line x1='2' y1='7' x2='7' y2='7'></line>
      <line x1='2' y1='17' x2='7' y2='17'></line>
      <line x1='17' y1='17' x2='22' y2='17'></line>
      <line x1='17' y1='7' x2='22' y2='7'></line>
    </svg>
  )
}

function AudioIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M9 18V5l12-2v13'></path>
      <circle cx='6' cy='18' r='3'></circle>
      <circle cx='18' cy='16' r='3'></circle>
    </svg>
  )
}

function CodeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='16 18 22 12 16 6'></polyline>
      <polyline points='8 6 2 12 8 18'></polyline>
    </svg>
  )
}

function ArchiveIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'></path>
      <polyline points='3.27 6.96 12 12.01 20.73 6.96'></polyline>
      <line x1='12' y1='22.08' x2='12' y2='12'></line>
    </svg>
  )
}

function GenericFileIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'></path>
      <polyline points='13 2 13 9 20 9'></polyline>
    </svg>
  )
}

function FileIcon({
  fileExtension,
  fileType,
  iconSize
}: {
  fileExtension: string
  fileType?: string
  iconSize: string
}) {
  const iconClasses = iconSize

  const isImage =
    fileType?.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)

  const isDocument = ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(
    fileExtension
  )

  const isSpreadsheet = ['xls', 'xlsx', 'csv'].includes(fileExtension)

  const isPresentation = ['ppt', 'pptx'].includes(fileExtension)

  const isVideo =
    fileType?.startsWith('video/') ||
    ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension)

  const isAudio =
    fileType?.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(fileExtension)

  const isCode = [
    'js',
    'jsx',
    'ts',
    'tsx',
    'html',
    'css',
    'json',
    'py',
    'java',
    'c',
    'cpp',
    'rb'
  ].includes(fileExtension)

  const isArchive = ['zip', 'rar', 'tar', 'gz', '7z'].includes(fileExtension)

  if (isImage) return <ImageIcon className={iconClasses} />
  if (isDocument) return <DocumentIcon className={iconClasses} />
  if (isSpreadsheet) return <SpreadsheetIcon className={iconClasses} />
  if (isPresentation) return <PresentationIcon className={iconClasses} />
  if (isVideo) return <VideoIcon className={iconClasses} />
  if (isAudio) return <AudioIcon className={iconClasses} />
  if (isCode) return <CodeIcon className={iconClasses} />
  if (isArchive) return <ArchiveIcon className={iconClasses} />

  return <GenericFileIcon className={iconClasses} />
}

export function FileThumbnail({
  fileName,
  fileType,
  thumbnailUrl,
  className = '',
  size = 'md'
}: FileThumbnailProps) {
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''

  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const iconSize = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  return thumbnailUrl ? (
    <div
      className={`flex-shrink-0 ${sizeStyles[size]} rounded overflow-hidden ${className}`}
    >
      <img
        src={thumbnailUrl}
        alt={fileName}
        className='w-full h-full object-cover'
      />
    </div>
  ) : (
    <div
      className={`flex-shrink-0 ${sizeStyles[size]} rounded flex items-center justify-center bg-gray-100 ${className}`}
    >
      <FileIcon
        fileExtension={fileExtension}
        fileType={fileType}
        iconSize={`${iconSize[size]} text-gray-500`}
      />
    </div>
  )
}
