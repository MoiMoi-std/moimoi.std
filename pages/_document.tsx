import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='vi'>
      <Head>
        <meta charSet='utf-8' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@400;600;700&family=Great+Vibes&family=Parisienne&family=Alex+Brush&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Cinzel:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Josefin+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap'
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
