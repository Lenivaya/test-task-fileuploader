'use client'

import { trpc } from '@file-uploader/trpc/client'
import { useState } from 'react'
import clsx from 'clsx'
import { Button, Card, CardHeader, CardContent, FileUploadZone } from '@repo/ui'

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number
  }>({})
  const utils = trpc.useContext()

  const uploadMutation = trpc.file.uploadFile.useMutation({
    onSuccess: () => {
      // Reset form and refresh file list
      setFiles([])
      setUploadProgress({})
      utils.file.getFiles.invalidate()
    }
  })

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    // Initialize progress for each file
    const initial = selectedFiles.reduce(
      (acc, file) => {
        acc[file.name] = 0
        return acc
      },
      {} as { [key: string]: number }
    )
    setUploadProgress(initial)
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)

    try {
      // Create an array of promises for each file upload
      const uploadPromises = files.map(async (file) => {
        // Convert file to base64 for transfer
        const reader = new FileReader()

        const fileData = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string
            // Remove data URL prefix if present
            const base64 = result.split(',')[1] || result
            resolve(base64)
          }

          // Add progress event to track reading progress
          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 50) // First 50% is reading
              setUploadProgress((prev) => ({ ...prev, [file.name]: progress }))
            }
          }

          reader.readAsDataURL(file)
        })

        // The next 50% is uploading
        await uploadMutation.mutateAsync({
          name: file.name,
          content: fileData,
          size: file.size,
          type: file.type
        })

        // Set to 100% when upload is complete
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
      })

      // Wait for all uploads to complete
      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className='ui-mb-6 ui-transform ui-transition-all ui-duration-300 hover:ui-shadow-lg'>
      <CardHeader
        title='Upload Files'
        subtitle='Select files to upload to the server'
        action={
          uploading && (
            <div className='ui-animate-pulse ui-bg-blue-100 ui-text-blue-700 ui-px-3 ui-py-1 ui-rounded-full ui-text-xs ui-font-medium'>
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

        {files.length > 0 && !uploading && (
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            className='ui-mt-6 ui-w-full ui-transition-transform ui-duration-200 ui-transform hover:ui-scale-105'
          >
            <span className='ui-flex ui-items-center ui-justify-center'>
              <svg
                className='ui-w-5 ui-h-5 ui-mr-2'
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
        )}

        {uploadMutation.isError && (
          <div className='ui-mt-4 ui-p-3 ui-bg-red-50 ui-border ui-border-red-100 ui-rounded-lg ui-text-sm ui-text-red-500'>
            <div className='ui-flex ui-items-center'>
              <svg
                className='ui-w-5 ui-h-5 ui-mr-2'
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
