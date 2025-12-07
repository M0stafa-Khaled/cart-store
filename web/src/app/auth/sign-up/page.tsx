"use client";

import { APIRes } from "@/interfaces";
import { handleResErr } from "@/utils/handleResErr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Field,
  FieldContent,
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
import { Eye, EyeOff, Mail, User, VenusAndMars } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Loader from "@/components/ui/loader";
import { signUpAction } from "@/actions/auth.actions";

const signUpSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .nonempty({ message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "Gender must be either 'Male' or 'Female' ",
  }),
});

export type SignUpForm = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      gender: "MALE",
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await signUpAction(data);
      if (!result.success) {
        setError(result.message || "Registration failed");
      } else {
        setSuccess(true);
        form.reset();

        // Redirect to sign in after 3 seconds
        toast.success(result.message);
        setTimeout(() => {
          router.push(
            `/auth/sign-in?message=Registration successful. Please check your email to verify your account.&email=${data.email}`
          );
        }, 3000);
      }
    } catch (err: unknown) {
      const apiError = err as APIRes;

      setError(
        apiError.message || "An unexpected error occurred. Please try again."
      );

      handleResErr(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-md md:max-w-sm lg:max-w-lg mx-auto">
      <h1 className="text-center text-2xl  font-bold tracking-tight border-b py-4 mb-2 md:hidden">
        Welcome to <span className=" text-main">Cart Store</span>
      </h1>
      <CardHeader>
        <CardTitle className={cn("text-center text-2xl font-semibold")}>
          Sign Up
        </CardTitle>
        <CardDescription className="text-center">
          Sign up to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
            Registration successful! Please check your email to verify your
            account. Redirecting to login...
          </div>
        )}
        <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <InputGroup
                    className="h-auto"
                    aria-invalid={fieldState.invalid}
                  >
                    <Input
                      {...field}
                      id="name"
                      placeholder="Name"
                      className="h-auto py-2.5"
                      disabled={isLoading}
                    />
                    <InputGroupAddon align={"inline-end"} className="ml-2">
                      <InputGroupText>
                        <User />
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
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldContent>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  </FieldContent>
                  <InputGroup
                    className="h-auto"
                    aria-invalid={fieldState.invalid}
                  >
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="gender"
                        className="min-w-[120px] w-full h-auto py-2.5"
                        disabled={isLoading}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value={"MALE"}>Male</SelectItem>
                        <SelectItem value={"FEMALE"}>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputGroupAddon align={"inline-end"} className="ml-2">
                      <InputGroupText>
                        <VenusAndMars />
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
          </FieldGroup>
          <Button
            type="submit"
            form="sign-up-form"
            disabled={isLoading}
            className="h-auto py-2.5 bg-main hover:bg-main/90 cursor-pointer w-full mt-3"
          >
            {isLoading ? (
              <>
                <Loader size={15} color="white" />
                <span>Signing up...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="flex items-center justify-center text-black/60 text-sm mt-2">
          <p>Already have an account? </p>{" "}
          <Link href="/auth/sign-in" className="text-main">
            {" "}
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;
