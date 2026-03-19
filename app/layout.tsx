import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Affordable Housing Program - Boma Yangu",
  description: "The Boma Yangu platform is the gateway into the Affordable Housing Program. Start your journey towards home ownership. Fulfil your dreams by letting us help you achieve your home ownership goals.",
  keywords: "affordable housing, Kenya, home ownership, Boma Yangu",
  authors: [{ name: "Boma Yangu" }],
  openGraph: {
    type: "website",
    siteName: "Affordable Housing Program - Boma Yangu",
    url: "https://www.bomayangu.go.ke",
    title: "www.bomayangu.go.ke - Affordable Housing Program.",
    description: "The Boma Yangu platform is the gateway into the Affordable Housing Program. Start your journey towards home ownership.",
    images: [
      {
        url: "https://bomayangu.go.ke/images/boma_wrap_logo.png",
        width: 1200,
        height: 630,
        alt: "Boma Yangu Logo",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "www.bomayangu.go.ke - Affordable Housing Program.",
    description: "The Boma Yangu platform is the gateway into the Affordable Housing Program.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: "#244FBB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} min-h-full flex flex-col font-inter text-gray-700`}>
        {children}
       
      </body>
    </html>
  );
}
