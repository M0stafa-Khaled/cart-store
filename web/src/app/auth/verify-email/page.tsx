"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyEmailAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("Invalid or missing verification token");
        setIsLoading(false);
        return;
      }

      try {
        const result = await verifyEmailAction(token);

        if (!result.success) {
          setError(result.message || "Email verification failed");
        } else {
          setSuccess(true);
          setMessage(result?.message || "Email verified successfully");

          // Redirect to sign in after 3 seconds
          setTimeout(() => {
            router.push(
              `/auth/sign-in?message=Email verified successfully. You can now sign in.&email=${searchParams.get(
                "email"
              )}`
            );
          }, 3000);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router, error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {isLoading
              ? "Verifying your email address..."
              : success
                ? "Your email has been verified"
                : "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
              <div className="text-sm text-muted-foreground">
                The verification link may have expired or is invalid. Please try
                registering again or contact support if the problem persists.
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Back to Sign Up</Link>
              </Button>
            </div>
          )}

          {success && message && (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                {message}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Redirecting to sign in page...
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/sign-in">Go to Sign In</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>Verifying your email address...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
