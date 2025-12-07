import CreateCategoryDialog from "@/app/dashboard/categories/_components/create-category-dialog";

const CategoriesHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <p className="text-muted-foreground">
          Manage your categories here. You can add, edit, or delete categories.
        </p>
      </div>
      <CreateCategoryDialog />
    </div>
  );
};

export default CategoriesHeader;
