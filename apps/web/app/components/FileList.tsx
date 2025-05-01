'use client'

import { trpc } from '@file-uploader/trpc/client'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Empty,
  FileCard
} from '@repo/ui'
import clsx from 'clsx'

export function FileList() {
  // Example of using tRPC client query
  const filesQuery = trpc.file.getFiles.useQuery()
  const deleteMutation = trpc.file.deleteFile.useMutation({
    onSuccess: () => {
      // Refresh the file list after deletion
      filesQuery.refetch()
    }
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id })
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const renderContent = () => {
    if (filesQuery.isLoading) {
      return (
        <div
          className={clsx(
            'py-8 text-center text-gray-500 animate-pulse flex flex-col items-center'
          )}
        >
          <svg
            className={clsx('w-10 h-10 mb-4 text-blue-300')}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='17 8 12 3 7 8' />
            <line x1='12' y1='3' x2='12' y2='15' />
          </svg>
          Loading files...
        </div>
      )
    }

    if (filesQuery.isError) {
      return (
        <div
          className={clsx(
            'py-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-100'
          )}
        >
          <svg
            className={clsx('w-8 h-8 mx-auto mb-3 text-red-400')}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='10'></circle>
            <line x1='12' y1='8' x2='12' y2='12'></line>
            <line x1='12' y1='16' x2='12.01' y2='16'></line>
          </svg>
          <p className={clsx('font-medium')}>Error loading files</p>
          <p className={clsx('text-sm mt-1')}>{filesQuery.error.message}</p>
        </div>
      )
    }

    const files = filesQuery.data || []

    if (files.length === 0) {
      return (
        <Empty
          title='No files yet'
          description='Upload some files to see them listed here.'
          action={
            <div
              className={clsx(
                'flex items-center justify-center text-sm text-gray-500 mt-2'
              )}
            >
              <svg
                className={clsx('w-5 h-5 mr-2 text-gray-400')}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
                <polyline points='17 8 12 3 7 8'></polyline>
                <line x1='12' y1='3' x2='12' y2='15'></line>
              </svg>
              Use the uploader above to add files
            </div>
          }
        />
      )
    }

    return (
      <div className={clsx('space-y-3')}>
        {files.map((file) => (
          <FileCard
            key={file.id}
            fileName={file.name}
            fileSize={file.size}
            fileType={file.mimeType}
            uploadDate={file.createdAt}
            actions={
              <div className={clsx('flex gap-2')}>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => window.open(file.url, '_blank')}
                >
                  View
                </Button>
                <Button
                  variant='danger'
                  size='sm'
                  onClick={() => handleDelete(file.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            }
          />
        ))}
      </div>
    )
  }

  return (
    <Card
      className={clsx('transform transition-all duration-300 hover:shadow-lg')}
    >
      <CardHeader
        title='Your Files'
        subtitle='Manage your uploaded files'
        action={
          filesQuery.data &&
          filesQuery.data.length > 0 && (
            <div className={clsx('flex items-center')}>
              <svg
                className={clsx('w-4 h-4 mr-1 text-blue-500')}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                <polyline points='14 2 14 8 20 8' />
                <line x1='16' y1='13' x2='8' y2='13' />
                <line x1='16' y1='17' x2='8' y2='17' />
                <polyline points='10 9 9 9 8 9' />
              </svg>
              <Badge variant='primary' size='md'>
                {filesQuery.data.length} file
                {filesQuery.data.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )
        }
      />
      <CardContent className={clsx('p-5')}>{renderContent()}</CardContent>
    </Card>
  )
}
