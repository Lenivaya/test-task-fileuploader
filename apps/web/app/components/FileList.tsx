'use client'

import { trpc } from '@file-uploader/trpc/client'
import { format, parseISO } from 'date-fns'

export function FileList() {
  // Example of using tRPC client query
  const filesQuery = trpc.file.getFiles.useQuery()
  const deleteMutation = trpc.file.deleteFile.useMutation({
    onSuccess: () => {
      // Refresh the file list after deletion
      filesQuery.refetch()
    }
  })

  if (filesQuery.isLoading) {
    return <div className='p-4'>Loading files...</div>
  }

  if (filesQuery.isError) {
    return (
      <div className='p-4 text-red-500'>
        Error loading files: {filesQuery.error.message}
      </div>
    )
  }

  const files = filesQuery.data || []

  const formatDate = (dateString: string | Date) => {
    try {
      const date =
        typeof dateString === 'string' ? parseISO(dateString) : dateString
      return format(date, 'PPP p') // Example: April 29, 2023, 1:25 PM
    } catch (error) {
      return 'Date unavailable'
    }
  }

  console.log(files)

  return (
    <div className='p-4'>
      <h2 className='text-xl font-semibold mb-4'>Files</h2>

      {files.length === 0 ? (
        <div className='text-gray-500'>No files uploaded yet</div>
      ) : (
        <ul className='space-y-2'>
          {files.map((file) => (
            <li
              key={file.id}
              className='p-3 border rounded flex justify-between items-center'
            >
              <div>
                <div className='font-medium'>{file.name}</div>
                <div className='text-sm text-gray-500'>
                  Uploaded on {formatDate(file.createdAt)}
                </div>
              </div>

              <button
                className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'
                onClick={async () => {
                  try {
                    await deleteMutation.mutateAsync({ id: file.id })
                  } catch (error) {
                    console.error('Failed to delete file:', error)
                  }
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
