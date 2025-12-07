import ProductsTableClient from "./products-table-client";
import ProductsFilters from "./products-filters";
import { getString } from "@/utils/getStr";
import { getAllProductsAction } from "@/actions/products.actions";
import ErrorRes from "@/components/shared/error";

const ProductsDataTable = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const pageNum = Number(getString(searchParams.page) ?? 1);
  const limitNum = Number(getString(searchParams.limit) ?? 20);
  const sort = getString(searchParams.sort);
  const search = getString(searchParams.search);
  const brand = getString(searchParams.brand);
  const category = getString(searchParams.category);
  const subCategory = getString(searchParams.subCategory);
  const title = getString(searchParams.title);
  const reviewsStr = getString(searchParams.reviews);

  const reviews =
    reviewsStr === "true" ? true : reviewsStr === "false" ? false : undefined;

  const res = await getAllProductsAction({
    page: pageNum,
    limit: limitNum,
    search,
    brand,
    category,
    reviews,
    sort,
    subCategory,
    title,
  });

  if (!res.success || res.error || !res.data) return <ErrorRes error={res} />;

  return (
    <div className="space-y-3">
      <ProductsFilters />

      <ProductsTableClient data={res.data?.items || []} meta={res.data.meta} />
    </div>
  );
};
export default ProductsDataTable;
