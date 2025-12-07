import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const ProductsHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">
          Manage your products here. You can add, edit, or delete products.
        </p>
      </div>
      <Link
        href="/dashboard/products/create"
        className={buttonVariants({
          className: "bg-main! hover:bg-main/90!",
        })}
      >
        <Plus className="mr-2 h-4 w-4" /> Create Product
      </Link>
    </div>
  );
};

export default ProductsHeader;
