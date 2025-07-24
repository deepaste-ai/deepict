import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import MantineRegistry from '@/components/basic/MantineRegistry';
import { isElectron } from '@/utils/platform';

export const metadata: Metadata = {
  title: 'Deepict',
  description: 'AI-powered JSON visualization tool',
  keywords: ['JSON', 'visualization', 'AI', 'data', 'analysis'],
  authors: [{ name: 'Deepict Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isElectronApp = isElectron();

  return (
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        {/* Add web-specific meta tags */}
        {!isElectronApp && (
          <>
            <meta name='apple-mobile-web-app-capable' content='yes' />
            <meta name='apple-mobile-web-app-status-bar-style' content='default' />
            <meta name='apple-mobile-web-app-title' content='Deepict' />
            <meta name='format-detection' content='telephone=no' />
            <meta name='mobile-web-app-capable' content='yes' />
            <meta name='msapplication-config' content='/browserconfig.xml' />
            <meta name='msapplication-TileColor' content='#000000' />
            <meta name='msapplication-tap-highlight' content='no' />
            <link rel='manifest' href='/manifest.json' />
            <link rel='shortcut icon' href='/favicon.ico' />
          </>
        )}
      </head>
      <body className={`antialiased ${isElectronApp ? 'overflow-hidden' : ''}`}>
        <MantineRegistry>{children}</MantineRegistry>
        {/* Add platform detection script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__PLATFORM_INFO__ = {
                isElectron: ${isElectronApp},
                isWeb: ${!isElectronApp},
                timestamp: ${Date.now()}
              };
            `,
          }}
        />
      </body>
    </html>
  );
}
