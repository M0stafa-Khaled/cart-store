import { Metadata } from "next";
import ProductForm from "../_components/product-form/product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Create New Product",
};

const CreateProductPage = () => {
  return (
    <div className="pb-8 space-y-8 px-4 ">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="h-10 w-10">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground mt-1">
            Add a new product to your inventory
          </p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
};

export default CreateProductPage;
