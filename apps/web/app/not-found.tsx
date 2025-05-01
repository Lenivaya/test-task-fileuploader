import { Button } from '@file-uploader/ui'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
      <div className='bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center'>
        <h1 className='text-6xl font-bold text-blue-600 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          Page Not Found
        </h2>
        <p className='text-gray-600 mb-8'>
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href='/' passHref>
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
