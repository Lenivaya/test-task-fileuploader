'use client'

import { trpc } from '@file-uploader/trpc/client'
import { useState } from 'react'

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const utils = trpc.useContext()

  const uploadMutation = trpc.file.uploadFile.useMutation({
    onSuccess: () => {
      // Reset form and refresh file list
      setFiles([])
      utils.file.getFiles.invalidate()
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)

    try {
      // Upload each file
      for (const file of files) {
        // Convert file to base64 for transfer
        const reader = new FileReader()

        const fileData = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string
            // Remove data URL prefix if present
            const base64 = result.split(',')[1] || result
            resolve(base64)
          }
          reader.readAsDataURL(file)
        })

        await uploadMutation.mutateAsync({
          name: file.name,
          content: fileData,
          size: file.size,
          type: file.type
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='p-4 border rounded mb-6'>
      <h2 className='text-xl font-semibold mb-4'>Upload Files</h2>

      <div className='mb-4'>
        <input
          type='file'
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className='block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
        />
      </div>

      {files.length > 0 && (
        <div className='mb-4'>
          <p className='text-sm text-gray-500'>
            {files.length} file(s) selected
          </p>
          <ul className='text-sm'>
            {files.map((file, index) => (
              <li key={index} className='truncate'>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadMutation.isError && (
        <div className='mt-2 text-sm text-red-500'>
          Upload failed: {uploadMutation.error.message}
        </div>
      )}
    </div>
  )
}
