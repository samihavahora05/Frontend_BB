import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const defaultGaId = 'G-7FTZWWKW27';
  const customGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';

  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <link rel="icon" href="/Boxxlogo.png" type="image/png" />
        <link rel="shortcut icon" href="/Boxxlogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Boxxlogo.png" />

        {/* Google tag (gtag.js) - Primary */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${defaultGaId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${defaultGaId}');
              ${customGaId && customGaId !== defaultGaId ? `gtag('config', '${customGaId}');` : ''}
            `,
          }}
        />

        {/* Additional Google tag if dynamic ID is set and distinct */}
        {customGaId && customGaId !== defaultGaId && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${customGaId}`}
          />
        )}

        {/* Google Tag Manager */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
