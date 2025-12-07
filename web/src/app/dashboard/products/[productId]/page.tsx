import { getProductByIdAction } from "@/actions/products.actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ProductImages from "./_components/product-images";
import ProductQuickStats from "./_components/product-quick-states";
import ProductBasicInfo from "./_components/product-baisc-info";
import ProductVariantsAndMetaData from "./_components/product-variants";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import DashboardProductReviews from "./_components/dashboard-product-reviews";
import ErrorRes from "@/components/shared/error";

export const metadata: Metadata = {
  title: "Product Details",
};

interface ProductDetailsPageProps {
  params: Promise<{ productId: string }>;
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { productId } = await params;
  const res = await getProductByIdAction(productId, { reviews: true });
  if (!res.success || !res.data || res.error) {
    if (res.statusCode === 404) notFound();
    return <ErrorRes error={res} />;
  }

  const product = res.data;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Product Details
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage product information
            </p>
          </div>
        </div>
        <div className="flex gap-2 ml-auto md:ml-0">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/products/${productId}/update`}>
              Edit Product
            </Link>
          </Button>
          <Button asChild className="bg-main hover:bg-main-90">
            <Link href={`/shop/products/${productId}`} target="_blank">
              View on Store
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden">
          <ProductImages product={product} />
        </div>

        <div className="lg:col-span-1">
          <ProductQuickStats product={product} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ProductBasicInfo product={product} />

        <ProductVariantsAndMetaData product={product} />
      </div>
      <Separator />
      <div>
        <DashboardProductReviews product={product} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
