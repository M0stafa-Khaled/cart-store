import { ICategory } from "@/interfaces";
import SubCategoryDialog from "./sub-category-dialog";

const SubCategoriesHeader = ({ categories }: { categories: ICategory[] }) => {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sub Categories</h2>
        <p className="text-muted-foreground">
          Manage your sub categories here. You can add, edit, or delete sub
          categories.
        </p>
      </div>
      <SubCategoryDialog categories={categories} />
    </div>
  );
};

export default SubCategoriesHeader;
