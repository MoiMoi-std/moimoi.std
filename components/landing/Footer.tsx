import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className='pt-16 pb-8 text-white bg-gray-900 border-t border-gray-800'>
      <div className='container px-4 mx-auto'>
        <div className='grid gap-12 mb-12 md:grid-cols-4'>
          {/* Cột 1: Brand */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-bold text-pink-500'>MoiMoi Studio</h3>
            <p className='text-sm leading-relaxed text-gray-400'>
              Nền tảng thiệp cưới online số 1 Việt Nam. Giúp bạn gửi lời mời trân trọng nhất đến người thân yêu theo
              cách hiện đại nhất.
            </p>
            <div className='flex gap-4 pt-2'>
              <a
                href='#'
                className='flex items-center justify-center w-10 h-10 transition bg-gray-800 rounded-full hover:bg-pink-600'
              >
                <Facebook className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='flex items-center justify-center w-10 h-10 transition bg-gray-800 rounded-full hover:bg-pink-600'
              >
                <Instagram className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Cột 2: Quick Links */}
          <div>
            <h4 className='mb-6 text-lg font-bold'>Liên Kết Nhanh</h4>
            <ul className='space-y-3 text-sm text-gray-400'>
              <li>
                <Link href='#templates' className='transition hover:text-pink-500'>
                  Mẫu thiệp mới
                </Link>
              </li>
              <li>
                <Link href='#features' className='transition hover:text-pink-500'>
                  Tính năng
                </Link>
              </li>
              <li>
                <Link href='#pricing' className='transition hover:text-pink-500'>
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link href='#' className='transition hover:text-pink-500'>
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Legal */}
          <div>
            <h4 className='mb-6 text-lg font-bold'>Chính Sách</h4>
            <ul className='space-y-3 text-sm text-gray-400'>
              <li>
                <a href='#' className='transition hover:text-pink-500'>
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href='#' className='transition hover:text-pink-500'>
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href='#' className='transition hover:text-pink-500'>
                  Chính sách hoàn tiền
                </a>
              </li>
              <li>
                <a href='#' className='transition hover:text-pink-500'>
                  Hướng dẫn thanh toán
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Contact */}
          <div>
            <h4 className='mb-6 text-lg font-bold'>Liên Hệ</h4>
            <ul className='space-y-4 text-sm text-gray-400'>
              <li className='flex items-start gap-3'>
                <MapPin className='w-5 h-5 text-pink-500 shrink-0' />
                <span>Tầng 3, Tòa nhà Innovation, Quận 1, TP.HCM</span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='w-5 h-5 text-pink-500 shrink-0' />
                <span>0909.123.456</span>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-pink-500 shrink-0' />
                <span>support@moimoi.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 text-sm text-center text-gray-500 border-t border-gray-800'>
          <p>© 2026 MoiMoi Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
