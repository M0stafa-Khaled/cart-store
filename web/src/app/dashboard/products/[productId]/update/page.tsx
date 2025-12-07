import { getProductByIdAction } from "@/actions/products.actions";
import ProductForm from "../../_components/product-form/product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ErrorRes from "@/components/shared/error";

export const metadata: Metadata = {
  title: "Update Product",
};

interface UpdateProductPageProps {
  params: Promise<{ productId: string }>;
}

const UpdateProductPage = async ({ params }: UpdateProductPageProps) => {
  const sp = await params;
  const res = await getProductByIdAction(sp.productId, {});

  if (!res.success || !res.data || res.error) {
    if (res.statusCode === 404) notFound();
    return <ErrorRes error={res} />;
  }

  return (
    <div className="pb-8 space-y-8 px-4 ">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="h-10 w-10">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Product</h1>
          <p className="text-muted-foreground mt-1">
            Modify product information and settings
          </p>
        </div>
      </div>

      <ProductForm product={res.data} />
    </div>
  );
};

export default UpdateProductPage;
