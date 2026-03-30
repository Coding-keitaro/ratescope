import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RateScope — 金利上昇不動産シミュレーター',
  description:
    '金利上昇が不動産価格・投資利回り・借入コストに与える影響をリアルタイムで試算できるシミュレーターです。',
  openGraph: {
    title: 'RateScope — 金利上昇不動産シミュレーター',
    description:
      '金利上昇が不動産価格・投資利回り・借入コストに与える影響をリアルタイムで試算できるシミュレーターです。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
