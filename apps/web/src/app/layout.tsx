import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'AI Hunter — Work Smarter. Win Faster.',
  description: 'AI-powered workspace for freelancers to discover opportunities, organize their pipeline, and grow their business.',
  openGraph: {
    title: 'AI Hunter — Work Smarter. Win Faster.',
    description: 'AI-powered workspace for freelancers to discover opportunities, organize their pipeline, and grow their business.',
    type: 'website',
    siteName: 'AI Hunter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Hunter — Work Smarter. Win Faster.',
    description: 'AI-powered workspace for freelancers to discover opportunities, organize their pipeline, and grow their business.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-neutral-50 text-neutral-900 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
