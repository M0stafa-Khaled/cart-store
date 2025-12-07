"use client";

import { APIRes } from "@/interfaces";
import { handleResErr } from "@/utils/handleResErr";
import z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
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
import { Mail } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";
import Link from "next/link";
import { useTransition } from "react";
import { forgotPasswordAction } from "@/actions/auth.actions";

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "mostafa6320005@gmail.com",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      startTransition(async () => {
        const res = await forgotPasswordAction(data);
        toast.success(res.message);
        localStorage.setItem("canResetPassword", "true");
        router.push("/reset-password");
      });
    } catch (err) {
      const apiError = err as APIRes;
      handleResErr(apiError);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-md md:max-w-sm lg:max-w-lg mx-auto">
      <CardHeader>
        <h1 className="text-center text-2xl  font-bold tracking-tight border-b py-4 mb-2 md:hidden">
          Welcome to <span className=" text-main">Cart Store</span>
        </h1>
        <CardTitle className={cn("text-center text-2xl font-semibold")}>
          Forgot Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we will send you a code to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                      disabled={isPending}
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
          </FieldGroup>
          <Button
            type="submit"
            form="reset-password-form"
            disabled={isPending}
            className="h-auto py-2.5 bg-mainver:bg-bg-main cursor-pointer w-full mt-6"
          >
            {isPending ? (
              <>
                <Loader size={15} color="white" />
                <span>Resetting Password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
          <div className="flex items-center justify-center text-black/60 text-sm mt-2">
            <p>Remember your password? </p>
            <Link href="/sign-in" className="text-main">
              Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordPage;
