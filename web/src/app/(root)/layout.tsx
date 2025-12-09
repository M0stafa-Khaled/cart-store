import Navbar from "@/app/(root)/_components/navbar/navbar";
import { Footer } from "./_components/footer/footer";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
export const metadata: Metadata = {
  title: "Cart Store - Your One-Stop Shop for Quality Products",
  description:
    "Discover amazing deals on electronics, fashion, home & garden, and more at Cart Store. Shop the latest products with free shipping, secure checkout, and unbeatable prices.",
  keywords:
    "online shopping, cart store, best deals, electronics, fashion, home decor, free shipping, secure checkout, quality products, discount shopping",
  authors: [{ name: "Cart Store" }],
  creator: "Cart Store",
  publisher: "Cart Store",
  category: "E-commerce",

  alternates: {
    canonical: baseUrl,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Cart Store",
    title: "Cart Store - Your One-Stop Shop for Quality Products",
    description:
      "Discover amazing deals on electronics, fashion, home & garden, and more. Shop with confidence - free shipping, secure checkout, and unbeatable prices.",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Cart Store - Online Shopping",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cartstore",
    creator: "@cartstore",
    title: "Cart Store - Your One-Stop Shop for Quality Products",
    description:
      "Discover amazing deals on electronics, fashion, home & garden, and more. Shop with confidence!",
    images: [`${baseUrl}/logo.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  other: {
    "og:locale:alternate": "ar_EG",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      {/* <hr className="mb-4 bg-gray-200" /> */}
      <Footer />
    </>
  );
};

export default RootLayout;
