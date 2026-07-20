import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'AI Hunter — Work Smarter. Win Faster.',
  description: 'AI-powered workspace for freelancers to discover opportunities, organize their pipeline, and grow their business.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
