import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer' // Mới
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Pricing from '@/components/landing/Pricing' // Mới
import TemplateGallery from '@/components/landing/TemplateGallery' // Mới
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>MoiMoi - Tạo Thiệp Mời & Thiệp Cưới Online Miễn Phí | moimoi.io.vn</title>
        <meta
          name='description'
          content='Tạo thiệp cưới online đẹp, hiện đại chỉ trong 1 phút. Tích hợp QR mừng cưới, RSVP, bản đồ chỉ đường. Gửi thiệp điện tử qua Zalo, Facebook. Dùng thử miễn phí!'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='keywords'
          content='thiệp cưới online, thiệp mời điện tử, tạo thiệp cưới, thiệp cưới miễn phí, thiệp mời sinh nhật, thiệp điện tử'
        />
        <meta name='robots' content='index, follow' />
        <link rel='canonical' href='https://www.moimoi.io.vn/' />

        {/* Open Graph */}
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='MoiMoi' />
        <meta property='og:title' content='MoiMoi - Tạo Thiệp Cưới & Thiệp Mời Online Miễn Phí' />
        <meta
          property='og:description'
          content='Tự tay thiết kế thiệp mời điện tử chuyên nghiệp. Tích hợp QR mừng cưới, RSVP, bản đồ. Chia sẻ qua Zalo, Facebook dễ dàng.'
        />
        <meta property='og:image' content='https://www.moimoi.io.vn/og-cover.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:url' content='https://www.moimoi.io.vn/' />
        <meta property='og:locale' content='vi_VN' />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='MoiMoi - Thiệp Cưới Online Miễn Phí' />
        <meta
          name='twitter:description'
          content='Tạo thiệp cưới điện tử đẹp, tích hợp QR mừng cưới và RSVP chuyên nghiệp.'
        />
        <meta name='twitter:image' content='https://www.moimoi.io.vn/og-cover.png' />

        {/* JSON-LD Schema */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'MoiMoi',
              url: 'https://www.moimoi.io.vn',
              operatingSystem: 'Web',
              applicationCategory: 'DesignApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'VND'
              },
              description: 'Nền tảng tạo thiệp mời và thiệp cưới điện tử trực tuyến miễn phí tại Việt Nam.',
              inLanguage: 'vi'
            })
          }}
        />
      </Head>

      <main className='min-h-screen font-sans text-gray-900'>
        <Header />
        <Hero />
        <Features />
        <TemplateGallery />
        <Pricing />
        <Footer />
      </main>
    </>
  )
}
