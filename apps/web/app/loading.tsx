export default function Loading() {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'>
      <div className='flex flex-col items-center'>
        <div className='w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
        <p className='mt-4 text-gray-700 font-medium'>Loading...</p>
      </div>
    </div>
  )
}
