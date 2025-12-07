import { getUserByIdAction } from "@/actions/users.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import UserQuickState from "./_components/user-quick-state";
import UserCardProfile from "./_components/user-card-profile";
import UserInfo from "./_components/user-info";
import UserOrdersHistory from "./_components/user-orders-history";
import UserAddresses from "./_components/user-addresses";
import ErrorRes from "@/components/shared/error";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;
  const result = await getUserByIdAction(userId);

  if (!result.success || !result.data) {
    if (result.statusCode === 404) notFound();
    throw result;
  }

  return {
    title: `${result.data.name}`,
    description: `View and manage user details for ${result.data.name}`,
  };
};

const UserDetailsPage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;
  const result = await getUserByIdAction(userId);

  if (!result.success || !result.data || result.error) {
    if (result.statusCode === 404) notFound();
    return <ErrorRes error={result} />;
  }

  const user = result.data;
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/users">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">
              Manage and view user information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-main hover:bg-main/90">
            <Link href={`/dashboard/users/${user.id}/update`}>
              <Edit className="mr-2 h-4 w-4" /> Edit User
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <UserCardProfile user={user} />

          <UserQuickState userId={userId} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <UserInfo user={user} />
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <UserOrdersHistory userId={userId} />
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <UserAddresses user={user} />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">
                          Last changed: Never
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
