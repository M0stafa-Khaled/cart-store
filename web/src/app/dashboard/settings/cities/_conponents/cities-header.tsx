import { ICountry } from "@/interfaces";
import CityDialog from "./city-dialog";

const CitiesHeader = ({ countries }: { countries: ICountry[] }) => {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cities</h2>
        <p className="text-muted-foreground">
          Manage your cities here. You can add, edit, or delete cities.
        </p>
      </div>
      <CityDialog countries={countries || []} />
    </div>
  );
};

export default CitiesHeader;
