"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IProduct } from "@/interfaces";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductBasicInfo } from "./product-basic-info";
import { ProductCategories } from "./product-categories";
import { ProductDiscount } from "./product-discount";
import { ProductImageUpload } from "./product-image-upload";
import { ProductVariants } from "./product-variants";
import { useProductForm } from "./use-product-form";
import Loader from "@/components/ui/loader";

const ProductForm = ({ product }: { product?: IProduct }) => {
  const router = useRouter();
  const {
    form,
    isEdit,
    loading,
    categories,
    subCategories,
    brands,
    imageCoverPreview,
    imagesPreview,
    colorInput,
    sizeInput,
    setColorInput,
    setSizeInput,
    onSubmit,
    handleImageCoverChange,
    handleImagesChange,
    removeImageCover,
    removeImage,
    addColor,
    removeColor,
    addSize,
    removeSize,
  } = useProductForm(product);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <ProductImageUpload
            form={form}
            imageCoverPreview={imageCoverPreview}
            imagesPreview={imagesPreview}
            onImageCoverChange={handleImageCoverChange}
            onImagesChange={handleImagesChange}
            onRemoveImageCover={removeImageCover}
            onRemoveImage={removeImage}
          />

          <div className="lg:col-span-2 space-y-6">
            <ProductBasicInfo form={form} />

            <ProductDiscount form={form} />

            <ProductCategories
              form={form}
              categories={categories}
              subCategories={subCategories}
              brands={brands}
            />

            <ProductVariants
              form={form}
              colorInput={colorInput}
              sizeInput={sizeInput}
              onColorInputChange={setColorInput}
              onSizeInputChange={setSizeInput}
              onAddColor={addColor}
              onAddSize={addSize}
              onRemoveColor={removeColor}
              onRemoveSize={removeSize}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 sticky bottom-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-4 border-t -mx-4 -mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/products")}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="min-w-[140px] bg-main hover:bg-main/90"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
