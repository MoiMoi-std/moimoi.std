import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  itemLabel?: string // e.g., "người dùng", "giao dịch", "yêu cầu"
  accentColor?: 'blue' | 'green' | 'indigo' | 'pink' // Theme color
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = 'items',
  accentColor = 'blue'
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const colorClasses = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    pink: 'bg-pink-600 text-white'
  }

  return (
    <div className='px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4'>
      <div className='text-sm text-gray-500'>
        Hiển thị {startItem} - {endItem} trong tổng số {totalItems} {itemLabel}
      </div>
      <div className='flex gap-2'>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              currentPage === page ? colorClasses[accentColor] : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className='px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
