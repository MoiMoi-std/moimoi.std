import { useToast } from '@/components/ui/ToastProvider'
import { WeddingContent } from '@/lib/data-service'
import { Copy, CreditCard } from 'lucide-react'

interface MoneyGiftProps {
  content: WeddingContent
}

const BANK_MAP: Record<string, string> = {
  Vietcombank: 'VCB',
  Techcombank: 'TCB',
  MBBank: 'MB',
  ACB: 'ACB',
  Vietinbank: 'ICB',
  BIDV: 'BIDV',
  VPBank: 'VPB',
  TPBank: 'TPB'
}

export default function MoneyGift({ content }: MoneyGiftProps) {
  const { toast } = useToast()

  if (!content.bank_name || !content.account_number) return null

  const bankCode = BANK_MAP[content.bank_name] || content.bank_name
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${content.account_number}-compact2.jpg?amount=0&addInfo=Mung%20Cuoi&accountName=${encodeURIComponent(content.account_name || '')}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast('Đã sao chép số tài khoản!', 'success')
  }

  return (
    <div className='max-w-md mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-pink-100'>
      <div className='bg-gradient-to-r from-pink-600 to-rose-500 p-6 text-white text-center'>
        <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm'>
          <CreditCard className='text-white' />
        </div>
        <h3 className='text-xl font-bold font-serif'>Hộp Mừng Cưới</h3>
        <p className='text-pink-100 text-sm opacity-90'>Gửi lời chúc và quà mừng đến cô dâu chú rể</p>
      </div>

      <div className='p-8 space-y-6'>
        {/* QR Code */}
        <div className='flex justify-center'>
          <div className='p-2 bg-white rounded-xl shadow-lg border border-gray-100'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt='VietQR' className='w-48 h-48 object-contain' />
          </div>
        </div>

        {/* Bank Info */}
        <div className='space-y-4 text-center'>
          <div>
            <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-1'>Ngân Hàng</div>
            <div className='text-lg font-bold text-gray-800'>{content.bank_name}</div>
          </div>
          <div>
            <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-1'>Chủ Tài Khoản</div>
            <div className='text-lg font-bold text-gray-800 uppercase'>{content.account_name}</div>
          </div>
          <div className='relative'>
            <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-1'>Số Tài Khoản</div>
            <div className='flex items-center justify-center gap-2'>
              <div className='text-xl font-mono font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-lg'>
                {content.account_number}
              </div>
              <button
                onClick={() => copyToClipboard(content.account_number || '')}
                className='p-2 text-gray-400 hover:text-pink-600 transition-colors'
                title='Sao chép'
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
