import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import SessionProvider from '@/contexts/SessionProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BidVista | B2B Vehicle Auction Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="BidVista is a professional B2B vehicle auction platform for verified dealers" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ErrorBoundary>
        <SessionProvider>
          <ThemeProvider>
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
