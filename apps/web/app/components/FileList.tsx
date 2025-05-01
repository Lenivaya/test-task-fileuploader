'use client'

import { trpc } from '@file-uploader/trpc/client'
import { format } from 'date-fns'
import {
  Card,
  CardHeader,
  CardContent,
  FileCard,
  Empty,
  Button,
  Badge
} from '@repo/ui'

interface File {
  id: string
  name: string
  size: number
  type?: string
  mimeType: string
  createdAt: Date
  updatedAt: Date
  url: string
  s3Key: string
  originalName: string
  status: string
}

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
        <div className='ui-py-8 ui-text-center ui-text-gray-500 ui-animate-pulse ui-flex ui-flex-col ui-items-center'>
          <svg
            className='ui-w-10 ui-h-10 ui-mb-4 ui-text-blue-300'
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
        <div className='ui-py-6 ui-text-center ui-text-red-500 ui-bg-red-50 ui-rounded-lg ui-border ui-border-red-100'>
          <svg
            className='ui-w-8 ui-h-8 ui-mx-auto ui-mb-3 ui-text-red-400'
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
          <p className='ui-font-medium'>Error loading files</p>
          <p className='ui-text-sm ui-mt-1'>{filesQuery.error.message}</p>
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
            <div className='ui-flex ui-items-center ui-justify-center ui-text-sm ui-text-gray-500 ui-mt-2'>
              <svg
                className='ui-w-5 ui-h-5 ui-mr-2 ui-text-gray-400'
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
      <div className='ui-space-y-3'>
        {files.map((file) => (
          <FileCard
            key={file.id}
            fileName={file.name}
            fileSize={file.size}
            fileType={file.mimeType}
            uploadDate={file.createdAt}
            actions={
              <div className='ui-flex ui-space-x-2'>
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
    <Card className='ui-transform ui-transition-all ui-duration-300 hover:ui-shadow-lg'>
      <CardHeader
        title='Your Files'
        subtitle='Manage your uploaded files'
        action={
          filesQuery.data &&
          filesQuery.data.length > 0 && (
            <div className='ui-flex ui-items-center'>
              <svg
                className='ui-w-4 ui-h-4 ui-mr-1 ui-text-blue-500'
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
      <CardContent className='ui-p-5'>{renderContent()}</CardContent>
    </Card>
  )
}
