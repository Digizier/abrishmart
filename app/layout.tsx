import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const viewport: Viewport = {
  themeColor: "#D92B83",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://abrishmart.store"),
  title: "Abrish Mart — Shop Smart, Save More! | Online Shopping Store Pakistan",
  description:
    "Abrish Mart is Pakistan's premier multi-category online shopping store. Discover premium bridal silk nightwear, kids educational toys, watches, and smart gadgets with Cash on Delivery across Pakistan.",
  icons: {
    icon: "/images/logo/logo-icon.png",
    shortcut: "/images/logo/logo-icon.png",
    apple: "/images/logo/logo-icon.png",
  },
  openGraph: {
    title: "Abrish Mart — Shop Smart, Save More!",
    description: "Multi-category online shopping store across Pakistan with Cash on Delivery.",
    url: "https://abrishmart.store",
    siteName: "Abrish Mart",
    images: [
      {
        url: "/images/banners/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Abrish Mart Pakistan",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo/logo-icon.png" sizes="any" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
