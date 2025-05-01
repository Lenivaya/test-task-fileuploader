'use client'

import { trpc } from '@file-uploader/trpc/client'
import { Button, Card, CardContent, CardHeader } from '@file-uploader/ui'
import { FileUploadZone } from '@file-uploader/ui/client'
import { useState, useCallback, useRef } from 'react'

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  )
  const abortControllerRef = useRef<AbortController | null>(null)
  const utils = trpc.useUtils()

  const uploadMutation = trpc.file.uploadFile.useMutation({
    onSuccess: () => {
      utils.file.getFiles.invalidate()
    }
  })

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles((prevFiles) => {
      const newFiles = selectedFiles.filter(
        (newFile) =>
          !prevFiles.some((existingFile) => existingFile.name === newFile.name)
      )

      setUploadProgress((prev) => ({
        ...prev,
        ...Object.fromEntries(newFiles.map((file) => [file.name, 0]))
      }))

      return [...prevFiles, ...newFiles]
    })
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    abortControllerRef.current = new AbortController()

    try {
      await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader()

          const fileData = await new Promise<string>((resolve, reject) => {
            reader.onload = (e) => {
              const result = e.target?.result as string
              const base64 = result.split(',')[1] || result
              resolve(base64)
            }

            reader.onerror = () =>
              reject(new Error(`Failed to read file: ${file.name}`))

            reader.onprogress = (event) => {
              if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 50)
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: progress
                }))
              }
            }

            reader.readAsDataURL(file)
          })

          // Check if upload was cancelled
          if (abortControllerRef.current?.signal.aborted) {
            throw new Error('Upload cancelled')
          }

          await uploadMutation.mutateAsync({
            name: file.name,
            content: fileData,
            size: file.size,
            type: file.type
          })

          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
        })
      )

      setFiles([])
      setUploadProgress({})
    } catch (error) {
      if (error instanceof Error && error.message === 'Upload cancelled') {
        console.log('Upload was cancelled')
      } else {
        console.error('Upload failed:', error)
      }
    } finally {
      setUploading(false)
      abortControllerRef.current = null
    }
  }

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  return (
    <Card className='mb-6 transform transition-all duration-300 hover:shadow-lg'>
      <CardHeader
        title='Upload Files'
        subtitle='Select files to upload to the server'
        action={
          uploading && (
            <div className='animate-pulse bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium'>
              Uploading...
            </div>
          )
        }
      />
      <CardContent>
        <FileUploadZone
          onFilesSelected={handleFilesSelected}
          disabled={uploading}
          isUploading={uploading}
          maxSizeInMB={10}
          progress={uploadProgress}
        />

        {files.length > 0 && (
          <div className='mt-6 flex gap-2'>
            {!uploading ? (
              <Button
                onClick={handleUpload}
                className='flex-1 transition-transform duration-200 transform hover:scale-105'
              >
                <span className='flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 mr-2'
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
                  Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                </span>
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={cancelUpload}
                className='flex-1'
              >
                Cancel Upload
              </Button>
            )}
          </div>
        )}

        {uploadMutation.isError && (
          <div className='mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-500'>
            <div className='flex items-center'>
              <svg
                className='w-5 h-5 mr-2'
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
              Upload failed: {uploadMutation.error.message}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
