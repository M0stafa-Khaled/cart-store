import CreateBrandDialog from "./create-brand-dialog";

const BrandsHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Brands</h2>
        <p className="text-muted-foreground">
          Manage your brands here. You can add, edit, or delete brands.
        </p>
      </div>
      <CreateBrandDialog />
    </div>
  );
};

export default BrandsHeader;
