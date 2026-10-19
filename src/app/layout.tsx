import type { Metadata } from 'next';
import { Geist_Mono, Rubik } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
// import ThemeSwitcher from "@/components/ThemeSwitcher";
// import dynamic from "next/dynamic";

// Rubik is the app's font (m-splitzy assets/fonts/experiments/rubik).
const appSans = Rubik({
  variable: '--font-app-sans',
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
        className={`${appSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
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
