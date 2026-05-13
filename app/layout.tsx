import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Watermark Remover - Remove Watermarks from Social Media Images',
  description: 'Professional watermark removal service for social media images. Remove TikTok, Instagram, and other watermarks instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
