import Head from 'next/head'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import TemplateGallery from '@/components/landing/TemplateGallery' // Mới
import Pricing from '@/components/landing/Pricing' // Mới
import Footer from '@/components/landing/Footer' // Mới

export default function Home() {
  return (
    <>
      <Head>
        <title>MoiMoi Studio | Thiệp Cưới Online 4.0</title>
        <meta name='description' content='Nền tảng tạo thiệp cưới online chuyên nghiệp.' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
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
