import React from 'react'

interface StudioLoadingProps {
  message?: string
}

const StudioLoading: React.FC<StudioLoadingProps> = ({ message = 'Đang tải...' }) => {
  return (
    <div className='flex items-center justify-center h-full min-h-[50vh]'>
      <div className='text-pink-600 animate-pulse text-lg font-medium'>{message}</div>
    </div>
  )
}

export default StudioLoading
