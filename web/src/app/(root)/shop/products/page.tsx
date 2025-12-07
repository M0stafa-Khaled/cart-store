import { getAllProductsAction } from "@/actions/products.actions";
import { getAllCategoriesAction } from "@/actions/categories.actions";
import { getAllBrandsAction } from "@/actions/brand.actions";
import { getAllSubCategoriesAction } from "@/actions/sub-categories.actions";
import ProductsPageClient from "./_components/products-page-client";
import { IProductParams } from "@/interfaces";
import ErrorPage from "@/components/shared/error-page";
import { Metadata } from "next";

interface ProductsPageProps {
  searchParams: Promise<IProductParams>;
}

export const generateMetadata = async ({
  searchParams,
}: ProductsPageProps): Promise<Metadata> => {
  const sp = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const titleParts: string[] = [];
  if (sp.search) titleParts.push(`"${sp.search}"`);
  if (sp.category) titleParts.push(sp.category);
  if (sp.subCategory) titleParts.push(sp.subCategory);
  if (sp.brand) titleParts.push(sp.brand);

  const dynamicTitle =
    titleParts.length > 0
      ? `${titleParts.join(" - ")} | Shop - Cart Store`
      : "Shop All Products | Cart Store";

  let description =
    "Browse our extensive collection of products at Cart Store.";
  if (sp.search) {
    description = `Search results for "${sp.search}" - Find the best deals on Cart Store.`;
  } else if (sp.category || sp.brand) {
    const filterDesc = [sp.category, sp.brand].filter(Boolean).join(" by ");
    description = `Shop ${filterDesc} products at the best prices. Free shipping available.`;
  }

  if (sp.minPrice || sp.maxPrice) {
    const priceRange =
      sp.minPrice && sp.maxPrice
        ? `${sp.minPrice} - ${sp.maxPrice} EGP`
        : sp.minPrice
          ? `from ${sp.minPrice} EGP`
          : `up to ${sp.maxPrice} EGP`;
    description += ` Price range: ${priceRange}.`;
  }

  const searchParamsString = new URLSearchParams(
    Object.entries(sp)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  const canonicalUrl = searchParamsString
    ? `${baseUrl}/shop/products?${searchParamsString}`
    : `${baseUrl}/shop/products`;

  const keywords = [
    "shop",
    "products",
    "cart store",
    "online shopping",
    "best deals",
    "free shipping",
    sp.category,
    sp.subCategory,
    sp.brand,
    sp.search,
  ].filter(Boolean);

  return {
    title: dynamicTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Cart Store" }],
    creator: "Cart Store",
    publisher: "Cart Store",

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "Cart Store",
      title: dynamicTitle,
      description,
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: "Cart Store - Shop All Products",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@cartstore",
      creator: "@cartstore",
      title: dynamicTitle,
      description,
      images: [`${baseUrl}/logo.png`],
    },

    robots: {
      index: !sp.search,
      follow: true,
      googleBot: {
        index: !sp.search,
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
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const sort = sp.sort || "desc";

  const { data, error, message, statusCode, success } =
    await getAllProductsAction({
      search: sp.search,
      category: sp.category,
      subCategory: sp.subCategory,
      brand: sp.brand,
      minPrice: sp.minPrice,
      maxPrice: sp.maxPrice,
      page,
      sort,
    });

  if (error || !data || !success) {
    return <ErrorPage error={{ message, code: statusCode }} />;
  }

  const [categoriesResponse, brandsResponse, subCategoriesResponse] =
    await Promise.all([
      getAllCategoriesAction({}),
      getAllBrandsAction({}),
      getAllSubCategoriesAction({}),
    ]);

  const initialProducts = data?.items || [];
  const initialMeta = data.meta;
  const categories = categoriesResponse.data || [];
  const brands = brandsResponse.data || [];
  const subCategories = subCategoriesResponse.data || [];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-6 pb-16">
      <ProductsPageClient
        products={initialProducts}
        meta={initialMeta}
        categories={categories}
        brands={brands}
        subCategories={subCategories}
        searchParams={sp}
      />
    </div>
  );
};

export default ProductsPage;
