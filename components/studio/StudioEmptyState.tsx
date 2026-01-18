import React from 'react'

interface StudioEmptyStateProps {
  message?: string
}

const StudioEmptyState: React.FC<StudioEmptyStateProps> = ({ message = 'Vui lòng tạo đám cưới trước.' }) => {
  return <div className='text-center mt-10 text-gray-500'>{message}</div>
}

export default StudioEmptyState
