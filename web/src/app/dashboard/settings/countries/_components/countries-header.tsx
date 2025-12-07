import CountryDialog from "./country-dialog";

const CountriesHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Countries</h2>
        <p className="text-muted-foreground">
          Manage your countries here. You can add, edit, or delete countries.
        </p>
      </div>
      <CountryDialog />
    </div>
  );
};

export default CountriesHeader;
