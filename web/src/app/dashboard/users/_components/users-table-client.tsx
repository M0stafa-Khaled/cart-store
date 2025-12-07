"use client";

import { DataTable } from "@/components/data-table";
import { useUserColumns } from "./users-columns";
import { IUser, IPaginationMeta } from "@/interfaces";

interface UsersTableClientProps {
  data: IUser[];
  meta?: IPaginationMeta;
}

const UsersTableClient = ({ data, meta }: UsersTableClientProps) => {
  const columns = useUserColumns();

  return <DataTable columns={columns} data={data} meta={meta} />;
};

export default UsersTableClient;
