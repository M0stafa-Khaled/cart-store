"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-session";

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
import { Eye, EyeOff, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import Loader from "@/components/ui/loader";
import { signInAction } from "@/actions/auth.actions";

const signInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type SignInForm = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  let errorParam = searchParams.get("error");
  const { update } = useSession();

  if (errorParam === "SessionExpired") {
    errorParam = "Session expired, please sign in again";
  }

  const messageParam = searchParams.get("message");
  const email = searchParams.get("email") || "";
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email,
      password: "",
    },
  });

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInAction(data);

      if (!result.success) {
        setErrorMessage(result.message || "Sign in failed");
        toast.error(result.message || "Sign in failed");
        return;
      }

      toast.success(result.message);

      // Update session to reflect new auth state
      await update();

      router.push(callbackUrl);
      router.refresh();
    } catch (_error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-md md:max-w-sm lg:max-w-lg mx-auto">
      <CardHeader>
        <h1 className="text-center text-2xl  font-bold tracking-tight border-b py-4 mb-2 md:hidden">
          Welcome to <span className=" text-main">Cart Store</span>
        </h1>
        <CardTitle className={cn("text-center text-2xl font-semibold")}>
          Sign In
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {messageParam && !errorMessage && !errorParam && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
            {messageParam}
          </div>
        )}

        {(errorMessage || errorParam) && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage || errorParam}
          </div>
        )}
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup
                    className="h-auto"
                    aria-invalid={fieldState.invalid}
                  >
                    <Input
                      {...field}
                      id="email"
                      placeholder="example@gmail.com"
                      className="h-auto py-2.5"
                      disabled={isLoading}
                    />
                    <InputGroupAddon align={"inline-end"} className="ml-2">
                      <InputGroupText>
                        <Mail />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="space-y-2">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
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
                        disabled={isLoading}
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
              <Link
                href="/auth/forgot-password"
                className="text-main text-sm w-full flex justify-end underline"
              >
                forgot password?
              </Link>
            </div>
          </FieldGroup>
          <Button
            type="submit"
            form="login-form"
            disabled={isLoading}
            className="h-auto py-2.5 bg-main hover:bg-main/90 cursor-pointer w-full mt-3"
          >
            {isLoading ? (
              <>
                <Loader size={15} color="white" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="flex items-center justify-center text-black/60 text-sm mt-2">
          <p>Don&apos;t have an account? </p>
          <Link href="/auth/sign-up" className="text-main">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
