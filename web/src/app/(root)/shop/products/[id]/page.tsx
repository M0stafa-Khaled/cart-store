import { notFound } from "next/navigation";
import { getProductByIdAction } from "@/actions/products.actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductReviews from "./_components/product-reviews";
import ProductImages from "./_components/product-images";
import ProductDetailsContent from "./_components/product-details-content";
import Link from "next/link";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const productId = (await params).id;
  const { data: product, error } = await getProductByIdAction(productId, {
    reviews: false,
  });

  if (!product || error) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cartstore.com";
  const productUrl = `${baseUrl}/shop/products/${product.id}`;

  const cleanDescription =
    product.description.trim() +
    (product.description.length > 157 ? "..." : "");

  const keywords = [
    product.title,
    product.category?.name,
    product.subCategory?.name,
    product.brand?.name,
    ...(product.colors || []),
    ...(product.sizes || []),
    "buy online",
    "cart store",
    "best price",
  ].filter(Boolean);

  return {
    title: `${product.title} | ${product.brand?.name || "Cart Store"}`,
    description: cleanDescription,
    keywords: keywords.join(", "),
    authors: [{ name: "Cart Store" }],
    creator: "Cart Store",
    publisher: "Cart Store",
    category: product.category?.name || "Products",

    alternates: {
      canonical: productUrl,
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: productUrl,
      siteName: "Cart Store",
      title: product.title,
      description: cleanDescription,
      images: [product.imageCover],
    },

    twitter: {
      card: "summary_large_image",
      site: "@cartstore",
      creator: "@cartstore",
      title: product.title,
      description: cleanDescription,
      images: [product.imageCover],
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
      "product:price:amount": String(
        product.priceAfterDiscount || product.price
      ),
      "product:price:currency": "EGP",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:brand": product.brand?.name || "",
      "product:category": product.category?.name || "",
      "og:price:amount": String(product.priceAfterDiscount || product.price),
      "og:price:currency": "EGP",
      "og:locale:alternate": "ar_EG",
    },
  };
};

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const productId = (await params).id;
  const { data: product, error, success } = await getProductByIdAction(productId, {
    reviews: true,
  });

  if (!product || error || !success) notFound();

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href={"/shop/products"}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImages product={product} />

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[60vh]">
              <Loader />
            </div>
          }
        >
          <ProductDetailsContent product={product} />
        </Suspense>
      </div>

      <ProductReviews
        reviews={product.reviews || []}
        ratingAverage={product.ratingAverage || 0}
        ratingQuantity={product.ratingQuantity || 0}
        productId={product.id}
      />
    </div>
  );
};

export default ProductDetailPage;
