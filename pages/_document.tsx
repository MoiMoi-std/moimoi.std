import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='vi'>
      <Head>
        <meta charSet='utf-8' />
        {/* Preconnect để giảm DNS lookup time */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        {/* Chỉ load Playfair Display (font chính), bỏ Merriweather để giảm 50KB+
            display=optional: không block render, chỉ dùng font nếu đã cache */}
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=optional'
          rel='stylesheet'
        />
        <link rel='icon' href='/image/logo-favicon.png' />
        <link rel='apple-touch-icon' href='/image/logo-favicon.png' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
