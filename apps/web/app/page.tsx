import { FileUploader } from './components/FileUploader'
import { FileList } from './components/FileList'

export default function Page() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex flex-col'>
      <div className='flex-1'>
        <div className='max-w-6xl mx-auto px-4 py-12'>
          <header className='mb-12 text-center'>
            <div className='inline-block mb-4 px-3 py-1 bg-blue-100 rounded-full text-blue-800 text-sm font-medium'>
              Secure File Management
            </div>
            <h1 className='text-4xl font-bold mb-3 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text'>
              File Management Platform
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Upload, manage, and organize your files in one secure location.
              Streamlined for efficiency and ease of use.
            </p>
          </header>

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
            <div className='flex space-x-4'>
              <a href='#' className='text-gray-500 hover:text-blue-600 text-sm'>
                Terms
              </a>
              <a href='#' className='text-gray-500 hover:text-blue-600 text-sm'>
                Privacy
              </a>
              <a href='#' className='text-gray-500 hover:text-blue-600 text-sm'>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
