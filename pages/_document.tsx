import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <link rel="icon" href="/Boxxlogo.png" type="image/png" />
        <link rel="shortcut icon" href="/Boxxlogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Boxxlogo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
