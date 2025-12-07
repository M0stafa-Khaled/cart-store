import { Metadata } from "next";
import {
  CategoriesSection,
  FeaturedProductsSection,
  FlashSaleSection,
  NewArrivalsSection,
  BrandsSection,
  NewsletterSection,
  HeroSection,
} from "./_components/home";
import { getHomepageDataAction } from "@/actions/homepage.actions";
import { MOCK_PRODUCTS } from "@/lib/constants";
import { IHomePage } from "@/interfaces";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cartstore.com";

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

const HomePage = async () => {
  const result = await getHomepageDataAction();

  let homepageData: IHomePage;
  if (result.success && result.data) {
    homepageData = result.data;
  } else {
    homepageData = {
      categories: [],
      featuredProducts: MOCK_PRODUCTS.slice(0, 8),
      flashSale: [],
      newArrivals: MOCK_PRODUCTS.slice(0, 8),
      brands: [],
    };
  }

  return (
    <>
      <HeroSection
        products={
          homepageData.featuredProducts.length > 0
            ? homepageData.featuredProducts.slice(0, 5)
            : MOCK_PRODUCTS.slice(0, 5)
        }
      />

      {homepageData.categories.length > 0 && (
        <CategoriesSection categories={homepageData.categories} />
      )}

      {homepageData.featuredProducts.length > 0 && (
        <FeaturedProductsSection products={homepageData.featuredProducts} />
      )}

      {homepageData.flashSale.length > 0 && (
        <FlashSaleSection products={homepageData.flashSale} />
      )}

      {homepageData.newArrivals.length > 0 && (
        <NewArrivalsSection products={homepageData.newArrivals} />
      )}

      {homepageData.brands.length > 0 && (
        <BrandsSection brands={homepageData.brands} />
      )}

      <NewsletterSection />
    </>
  );
};

export default HomePage;
