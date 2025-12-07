import { getUserByIdAction } from "@/actions/users.actions";
import UserForm from "../../_components/user-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ErrorRes from "@/components/shared/error";

interface UpdateUserPageProps {
  params: Promise<{ userId: string }>;
}

export const metadata: Metadata = {
  title: "Update User",
};

const UpdateUserPage = async ({ params }: UpdateUserPageProps) => {
  const sp = await params;
  const result = await getUserByIdAction(sp.userId);

  if (!result.success || !result.data || result.error) {
    if (result.statusCode === 404) notFound();
    return <ErrorRes error={result} />;
  }

  const user = result.data;

  return (
    <div className="pb-8 space-y-8 px-4 ">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="h-10 w-10">
          <Link href="/dashboard/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update User</h1>
          <p className="text-muted-foreground mt-1">
            Modify user information and settings
          </p>
        </div>
      </div>

      <UserForm user={user} />
    </div>
  );
};

export default UpdateUserPage;
