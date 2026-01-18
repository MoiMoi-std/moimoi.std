import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { Check, Loader2, Send } from 'lucide-react'
import { useState } from 'react'

interface RSVPFormProps {
  weddingId: string
}

export default function RSVPForm({ weddingId }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    guest_name: '',
    phone: '',
    is_attending: true,
    adults: 1,
    children: 0,
    meal_preference: '',
    wishes: '',
    website: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast, success, error } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.website) {
      return
    }

    if (!formData.guest_name) {
      toast('Vui lòng nhập tên của bạn', 'warning')
      return
    }

    if (formData.phone && !/^(0|\+84)\d{9,10}$/.test(formData.phone.trim())) {
      toast('Số điện thoại chưa đúng định dạng', 'warning')
      return
    }

    const lastSubmitKey = `rsvp_last_submit_${weddingId}`
    const lastSubmit = typeof window !== 'undefined' ? localStorage.getItem(lastSubmitKey) : null
    if (lastSubmit && Date.now() - Number(lastSubmit) < 5 * 60 * 1000) {
      toast('Bạn vừa gửi RSVP gần đây. Vui lòng thử lại sau ít phút.', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const attendingAdults = formData.is_attending ? formData.adults : 0
      const attendingChildren = formData.is_attending ? formData.children : 0
      const partySize = attendingAdults + attendingChildren
      const meta: string[] = []
      if (formData.is_attending) {
        meta.push(`Người lớn: ${attendingAdults}`)
        meta.push(`Trẻ em: ${attendingChildren}`)
      }
      if (formData.meal_preference) {
        meta.push(`Thực đơn: ${formData.meal_preference}`)
      }
      const metaText = meta.length ? ` [${meta.join(', ')}]` : ''
      const wishesText = formData.wishes.trim()

      const result = await dataService.createRSVP({
        wedding_id: weddingId,
        guest_name: formData.guest_name,
        phone: formData.phone,
        is_attending: formData.is_attending,
        party_size: partySize,
        wishes: `${wishesText}${metaText}`.trim()
      })

      if (result) {
        setSubmitted(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem(lastSubmitKey, Date.now().toString())
        }
        success('Gửi phản hồi thành công! Cảm ơn bạn.')
      } else {
        error('Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (e) {
      error('Không thể gửi phản hồi. Vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className='max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl text-center border border-green-100'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600'>
          <Check size={32} />
        </div>
        <h3 className='text-2xl font-serif font-bold text-gray-900 mb-2'>Cảm Ơn Bạn!</h3>
        <p className='text-gray-500'>
          Thông tin phản hồi của bạn đã được ghi nhận. Hẹn gặp bạn tại buổi tiệc vô cùng đặc biệt này nhé!
        </p>
      </div>
    )
  }

  return (
    <div className='max-w-xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-pink-100'>
      <div className='text-center mb-8'>
        <h3 className='text-3xl font-serif font-bold text-gray-900 mb-2'>Xác Nhận Tham Dự</h3>
        <p className='text-gray-500'>Vui lòng cho chúng mình biết bạn có thể tham dự hay không nhé!</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Guest Name */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>Tên của bạn</label>
          <input
            type='text'
            required
            className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
            placeholder='VD: Nguyễn Văn A'
            value={formData.guest_name}
            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>Số điện thoại (Tùy chọn)</label>
          <input
            type='tel'
            className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
            placeholder='Để chúng mình tiện liên lạc'
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {/* Honeypot */}
        <input
          type='text'
          tabIndex={-1}
          autoComplete='off'
          className='hidden'
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />

        {/* Attendance Status */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>Bạn sẽ tham dự chứ?</label>
          <div className='grid grid-cols-2 gap-4'>
            <button
              type='button'
              onClick={() => setFormData({ ...formData, is_attending: true })}
              className={`p-4 rounded-xl border-2 transition-all font-bold ${
                formData.is_attending
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-pink-200'
              }`}
            >
              🎉 Chắc chắn rồi
            </button>
            <button
              type='button'
              onClick={() => setFormData({ ...formData, is_attending: false })}
              className={`p-4 rounded-xl border-2 transition-all font-bold ${
                !formData.is_attending
                  ? 'border-gray-500 bg-gray-100 text-gray-700'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              😢 Tiếc quá, mình bận
            </button>
          </div>
        </div>

        {/* Party Size (Only show if attending) */}
        {formData.is_attending && (
          <div className='animate-in fade-in slide-in-from-top-2'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>Số lượng người tham dự</label>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-xs text-gray-500 mb-1'>Người lớn</div>
                <input
                  type='number'
                  min={1}
                  max={20}
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: Math.max(1, Number(e.target.value || 1)) })}
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
                />
              </div>
              <div>
                <div className='text-xs text-gray-500 mb-1'>Trẻ em</div>
                <input
                  type='number'
                  min={0}
                  max={20}
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: Math.max(0, Number(e.target.value || 0)) })}
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
                />
              </div>
            </div>
          </div>
        )}

        {/* Meal Preference */}
        {formData.is_attending && (
          <div className='animate-in fade-in slide-in-from-top-2'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>Chế độ ăn uống (Tùy chọn)</label>
            <select
              value={formData.meal_preference}
              onChange={(e) => setFormData({ ...formData, meal_preference: e.target.value })}
              className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
            >
              <option value=''>Không yêu cầu</option>
              <option value='Ăn chay'>Ăn chay</option>
              <option value='Ít cay'>Ít cay</option>
              <option value='Không hải sản'>Không hải sản</option>
            </select>
          </div>
        )}

        {/* Wishes */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>Gửi lời chúc (Tùy chọn)</label>
          <textarea
            rows={3}
            className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium resize-none'
            placeholder='Gửi những lời chúc tốt đẹp nhất đến cô dâu chú rể...'
            value={formData.wishes}
            onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={submitting}
          className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-pink-200 hover:scale-[1.02] hover:shadow-pink-300 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        >
          {submitting ? (
            <>
              <Loader2 className='animate-spin' /> Đang gửi...
            </>
          ) : (
            <>
              <Send size={20} /> Gửi Phản Hồi
            </>
          )}
        </button>
      </form>
    </div>
  )
}
