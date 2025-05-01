import { FileUploader } from './components/FileUploader'
import { FileList } from './components/FileList'

export default function Page() {
  return (
    <main className='flex flex-col items-center min-h-screen p-8'>
      <div className='w-full max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-center'>
          File Management Platform
        </h1>

        <FileUploader />
        <FileList />
      </div>
    </main>
  )
}
