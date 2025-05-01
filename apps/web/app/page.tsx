import { FileUploader } from './components/FileUploader'
import { FileList } from './components/FileList'
import clsx from 'clsx'

export default function Page() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex flex-col'>
      <div className='flex-1'>
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <div className='grid gap-8 md:grid-cols-1 lg:grid-cols-1'>
            <FileUploader />
            <FileList />
          </div>
        </div>
      </div>

      <footer className='bg-gray-50 border-t border-gray-200 py-8 mt-12'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-4 md:mb-0'>
              <p className='text-gray-500 text-sm'>
                © {new Date().getFullYear()} File Management Platform. All
                rights reserved.
              </p>
            </div>
            <div className='flex space-x-6'>
              <a
                href='#'
                className='text-gray-500 hover:text-blue-600 text-sm font-medium'
              >
                Terms
              </a>
              <a
                href='#'
                className='text-gray-500 hover:text-blue-600 text-sm font-medium'
              >
                Privacy
              </a>
              <a
                href='#'
                className='text-gray-500 hover:text-blue-600 text-sm font-medium'
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
