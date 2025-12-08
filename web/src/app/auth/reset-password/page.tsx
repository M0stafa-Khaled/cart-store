"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/ui/loader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleActionError } from "@/lib/error-handlers";
import { resetPasswordAction } from "@/actions/auth.actions";

const resetPasswordSchema = z.object({
  otp: z.string().length(6, { message: "Code must be 6 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
    },
  });

  useEffect(() => {
    if (localStorage.getItem("canResetPassword") !== "true") {
      router.push("/sign-in");
    }
  }, [router]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const res = await resetPasswordAction(data);
      if (!res.success) throw res;
      toast.success(res.message);
      localStorage.removeItem("canResetPassword");
      router.push("/sign-in");
    } catch (error) {
      handleActionError(error);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-md md:max-w-sm lg:max-w-lg mx-auto">
      <h1 className="text-center text-2xl  font-bold tracking-tight border-b py-4 mb-2 md:hidden">
        Welcome to <span className=" text-main">Cart Store</span>
      </h1>
      <CardHeader>
        <CardTitle className={cn("text-center text-2xl font-semibold")}>
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter the code sent to your email and set a new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                  <InputGroup
                    className="h-auto"
                    aria-invalid={fieldState.invalid}
                  >
                    <Input
                      {...field}
                      id="otp"
                      type="text"
                      placeholder="123456"
                      className="h-auto py-2.5"
                      disabled={form.formState.isSubmitting}
                    />
                    <InputGroupAddon align={"inline-end"} className="ml-2">
                      <InputGroupText>
                        <KeyRound />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <InputGroup
                    className="h-auto"
                    aria-invalid={fieldState.invalid}
                  >
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="h-auto py-2.5"
                      disabled={form.formState.isSubmitting}
                    />
                    <InputGroupAddon
                      align={"inline-end"}
                      className="ml-2 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <InputGroupText>
                        {showPassword ? <Eye /> : <EyeOff />}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            type="submit"
            form="login-form"
            disabled={form.formState.isSubmitting}
            className="h-auto py-2.5 bg-main hover:bg-main/90 cursor-pointer w-full mt-3"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader size={15} color="white" />
                <span>Resetting Password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
        <div className="flex items-center justify-center text-black/60 text-sm mt-2">
          <p>Remember your password? </p>
          <Link href="/sign-in" className="text-main">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
