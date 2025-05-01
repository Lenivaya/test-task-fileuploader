import { FileList } from './components/FileList'
import { FileUploader } from './components/FileUploader'

export default function Page() {
  return (
    <main className='flex min-h-screen flex-col bg-gradient-to-b from-blue-50 via-white to-gray-50'>
      <div className='container mx-auto max-w-6xl flex-1 px-4 py-8'>
        <div className='space-y-8'>
          <FileUploader />
          <FileList />
        </div>
      </div>
    </main>
  )
}
