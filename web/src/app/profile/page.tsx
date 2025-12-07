import { getUserProfileAction } from "@/actions/profile.actions";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MapPin, CreditCard, Bell } from "lucide-react";
import ProfileInfo from "./_components/profile-info";
import UserAddresses from "./_components/profile-addresses";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ErrorRes from "@/components/shared/error";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUserProfileAction();
  return {
    title: `Profile – ${user?.data?.name}`,
    description: `Profile – ${user?.data?.name}`,
  };
}

const ProfilePage = async () => {
  const result = await getUserProfileAction();

  if (!result.success || !result.data || result.error) return <ErrorRes error={result} />;

  const user = result.data;

  return (
    <div className="container mx-auto pt-6 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and personal data.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4 shrink-0 space-y-6">
          <Card className="overflow-hidden border-none shadow-md bg-linear-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-4">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-full object-cover border-4 border-background shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-sm">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
              </div>
              <h2 className="font-bold text-xl">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </CardContent>
          </Card>

          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
            <TabsTrigger
              value="profile"
              className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all hover:bg-muted"
            >
              <User className="mr-3 h-5 w-5" />
              Profile Information
            </TabsTrigger>

            <Link
              href="/profile/my-orders"
              className="flex w-full justify-start px-4 py-3 h-auto text-base font-medium hover:text-primary rounded-md transition-all hover:bg-muted"
            >
              <Package className="mr-3 h-5 w-5" />
              My Orders
            </Link>

            <TabsTrigger
              value="addresses"
              className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all hover:bg-muted"
            >
              <MapPin className="mr-3 h-5 w-5" />
              Shipping Addresses
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all hover:bg-muted"
              disabled
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger
              disabled
              value="addresses"
              className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all hover:bg-muted"
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
            </TabsTrigger>
          </TabsList>
        </aside>

        <div className="flex-1 lg:max-w-4xl">
          <TabsContent value="profile" className="mt-0 space-y-6">
            <ProfileInfo user={user} />
          </TabsContent>

          <TabsContent value="addresses" className="mt-0 space-y-6">
            <UserAddresses />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
