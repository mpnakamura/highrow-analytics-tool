import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BTCトレード分析ツール',
  description: 'CSVファイルからBTCトレードデータを分析するツール',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}