import UsersTableClient from "./users-table-client";
import UsersFilters from "./users-filters";

import { getAllUsersAction } from "@/actions/users.actions";
import { getString } from "@/utils/getStr";
import { Role } from "@/interfaces";
import ErrorRes from "@/components/shared/error";

const UsersDataTable = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const pageNum = Number(getString(searchParams.page) ?? 1);
  const limitNum = Number(getString(searchParams.limit) ?? 20);
  const q = getString(searchParams.q);
  const role = getString(searchParams.role) as Role | undefined;
  const activeStr = getString(searchParams.active);
  const isVerifiedStr = getString(searchParams.isVerified);

  const active =
    activeStr === "true" ? true : activeStr === "false" ? false : undefined;

  const isVerified =
    isVerifiedStr === "true"
      ? true
      : isVerifiedStr === "false"
        ? false
        : undefined;

  const res = await getAllUsersAction({
    page: pageNum,
    limit: limitNum,
    q,
    role,
    active,
    isVerified,
  });

  if (!res.success || !res.data || res.error) return <ErrorRes error={res} />;

  return (
    <div className="space-y-3">
      <UsersFilters />

      <UsersTableClient data={res.data.items || []} meta={res.data.meta} />
    </div>
  );
};
export default UsersDataTable;
