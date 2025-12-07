"use client";
import { getAllBrandsAction } from "@/actions/brand.actions";
import { getAllCategoriesAction } from "@/actions/categories.actions";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/products.actions";
import { getAllSubCategoriesAction } from "@/actions/sub-categories.actions";
import {
  APIRes,
  IBrand,
  ICategory,
  IProduct,
  ISubCategory,
} from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const getProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  stock: z.coerce.number<number>().min(0, "Stock must be at least 0"),
  price: z.coerce.number<number>().min(0, "Price must be at least 0"),
  discountType: z.enum(["PERCENTAGE", "FIXED", "none"]).optional(),
  discountValue: z.coerce.number<number>().min(0).optional(),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().min(1, "Subcategory is required"),
  brandId: z.string().min(1, "Brand is required"),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  imageCover: z.any().optional(),
  images: z.any().optional(),
});

export type ProductFormValues = z.infer<typeof getProductSchema>;

export const useProductForm = (product?: IProduct) => {
  const router = useRouter();
  const [imageCoverPreview, setImageCoverPreview] = useState<string | null>(
    product?.imageCover || null
  );
  const [imagesPreview, setImagesPreview] = useState<string[]>(
    product?.images || []
  );
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);

  const isEdit = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(getProductSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      stock: product?.stock || 0,
      price: product?.price || 0,
      discountType: product?.discountType || "none",
      discountValue: product?.discountValue || undefined,
      categoryId: product?.category?.id || "",
      subCategoryId: product?.subCategory?.id || "",
      brandId: product?.brand?.id || "",
      colors: product?.colors || [],
      sizes: product?.sizes || [],
    },
  });

  // Fetch categories, subcategories, and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subCategoriesRes, brandsRes] = await Promise.all([
          getAllCategoriesAction({}),
          getAllSubCategoriesAction({}),
          getAllBrandsAction({}),
        ]);

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (subCategoriesRes.success && subCategoriesRes.data) {
          setSubCategories(subCategoriesRes.data);
        }
        if (brandsRes.success && brandsRes.data) {
          setBrands(brandsRes.data);
        }
      } catch (error) {
        handleActionError(error as APIRes);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values: ProductFormValues) => {
    if (!isEdit && !values.imageCover) {
      toast.error("Image cover is required");
      return;
    }

    if (values.images?.length > 6) {
      toast.error("You can upload up to 6 images");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("stock", values.stock.toString());
      formData.append("price", values.price.toString());
      formData.append("categoryId", values.categoryId);
      formData.append("subCategoryId", values.subCategoryId);
      formData.append("brandId", values.brandId);

      if (values.discountType && values.discountType !== "none")
        formData.append("discountType", values.discountType);
      if (
        values.discountValue &&
        values.discountValue > 0 &&
        values.discountType !== "none"
      )
        formData.append("discountValue", values.discountValue.toString());

      formData.append("colors", JSON.stringify(values.colors));

      formData.append("sizes", JSON.stringify(values.sizes));

      if (values.imageCover) formData.append("imageCover", values.imageCover);

      if (values.images) {
        Array.from(values.images).forEach((file: any) => {
          formData.append("images", file);
        });
      }

      let res: APIRes<IProduct> | APIRes;
      if (isEdit && product) {
        res = await updateProductAction(product.id, formData);
      } else {
        res = await createProductAction(formData);
      }

      if (!res.success) throw res;

      toast.success(res.message);
      return router.push("/dashboard/products");
    } catch (error) {
      handleActionError(error as APIRes);
    }
  };

  const handleImageCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("imageCover", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      form.setValue("images", files);
      const previews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setImagesPreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImageCover = () => {
    form.setValue("imageCover", undefined);
    setImageCoverPreview(null);
  };

  const removeImage = (index: number) => {
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    setImagesPreview(newPreviews);
  };

  const addColor = () => {
    if (colorInput.trim()) {
      const currentColors = form.getValues("colors") || [];
      form.setValue("colors", [...currentColors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const removeColor = (index: number) => {
    const currentColors = form.getValues("colors") || [];
    form.setValue(
      "colors",
      currentColors.filter((_, i) => i !== index)
    );
  };

  const addSize = () => {
    if (sizeInput.trim()) {
      const currentSizes = form.getValues("sizes") || [];
      form.setValue("sizes", [...currentSizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const removeSize = (index: number) => {
    const currentSizes = form.getValues("sizes") || [];
    form.setValue(
      "sizes",
      currentSizes.filter((_, i) => i !== index)
    );
  };

  return {
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
  };
};
