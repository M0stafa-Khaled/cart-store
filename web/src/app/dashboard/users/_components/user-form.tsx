"use client";

import { createUserAction, updateUserAction } from "@/actions/users.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/hooks/use-session";
import { APIRes, IUser } from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  UserCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const getUserSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email"),
    password: isEdit
      ? z.string().optional()
      : z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["USER", "ADMIN"]),
    gender: z.enum(["MALE", "FEMALE"]),
    phone: z.string().optional(),
    active: z.boolean().default(true).optional(),
    avatar: z.any().optional(),
  });

const UserForm = ({ user }: { user?: IUser }) => {
  const { user: sessionUser } = useSession();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.avatar || null
  );

  const isEdit = !!user;

  const form = useForm<z.infer<ReturnType<typeof getUserSchema>>>({
    resolver: zodResolver(getUserSchema(isEdit)),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "USER",
      gender: user?.gender || "MALE",
      phone: user?.phone || "",
      active: user?.active ?? true,
    },
  });

  const onSubmit = async (
    values: z.infer<ReturnType<typeof getUserSchema>>
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (values.password) formData.append("password", values.password);
      formData.append("role", values.role);
      formData.append("gender", values.gender);
      if (values.phone) formData.append("phone", values.phone);
      formData.append("active", String(values.active));
      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }

      let res: APIRes<IUser> | APIRes;
      if (isEdit && user) {
        res = await updateUserAction(user.id, formData);
      } else {
        res = await createUserAction(formData);
      }

      if (!res.success) throw res;

      toast.success(
        sessionUser?.id === user?.id
          ? "Profile updated successfully, please sign in again"
          : res.message
      );
      if (isEdit && user && sessionUser?.id === user.id) {
        await signOut({
          redirectTo: "/auth/sign-in",
          redirect: true,
        });
      }
      return router.push("/dashboard/users");
    } catch (error) {
      handleActionError(error as APIRes);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("avatar", undefined);
    setImagePreview(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a profile picture for the user.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({
                  field: { value: _value, onChange: _onChange, ...field },
                }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group cursor-pointer">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-muted bg-muted flex items-center justify-center">
                          {imagePreview ? (
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-16 h-16 text-muted-foreground" />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <Input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={handleImageChange}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <div className="text-center">
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive mt-2"
                          onClick={removeImage}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full space-y-4 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          {field.value
                            ? "User account is active"
                            : "User account is inactive"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Enter the user&apos;s personal and account information.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter user name"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="example@example.com"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="+1234567890"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <UserCheck className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                            <SelectTrigger className="pl-9 w-full">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isEdit ? "New Password (Optional)" : "Password"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder={
                              isEdit ? "Leave blank to keep current" : "******"
                            }
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/users")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="min-w-[120px] bg-main hover:bg-main/90"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
