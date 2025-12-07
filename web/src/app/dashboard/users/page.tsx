import UsersDataTable from "./_components/users-data-table";
import Loader from "@/components/ui/loader";
import { Suspense } from "react";
import UsersHeader from "./_components/users-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
};

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="space-y-4">
      <UsersHeader />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <UsersDataTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default UsersPage;
