'use client'

import { Button } from '@file-uploader/ui'
import { useEffect } from 'react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full'>
        <div className='flex flex-col items-center text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-8 h-8 text-red-500'
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
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Something went wrong
          </h1>
          <p className='text-gray-600 mb-6'>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  )
}
