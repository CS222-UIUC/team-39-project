// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
import type { Metadata, Viewport } from "next";
import './globals.css'
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
  
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FlavorBook",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
          {/* Layout UI */}
          {/* Place children where you want to render a page or nested layout */}
          <main>{children}</main>
        </body>
      </html>
    )
  }