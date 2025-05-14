import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
// import ThemeSwitcher from "@/components/ThemeSwitcher";
// import dynamic from "next/dynamic";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Combifi',
  description: 'Your unified finance app',
  metadataBase: new URL('https://combifi.app'),

  openGraph: {
    title: 'Combifi',
    description: 'Your unified finance app',
    url: 'https://combifi.app',
    siteName: 'Combifi',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Combifi',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          {/* <ThemeSwitcher /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
