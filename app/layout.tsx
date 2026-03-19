import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared";
import { Providers } from "@/components/shared/providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ковры и ковровые дорожки - Магазин на рынке Садовод, Москва",
  description: "Купить ковер в Москве на рынке Садовод. Широкий выбор ковровых дорожек и покрытий для дома. Натуральная шерсть, синтетика, разные размеры. Доставка по России. Низкие цены.",
  keywords: "ковры, ковровые дорожки, купить ковер, рынок Садовод, Москва, ковры для дома, ковровые покрытия",
  creator: "Магазин ковров Садовод",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <Header />
        </header>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
