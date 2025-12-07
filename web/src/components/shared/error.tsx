"use client";
import { Home, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { APIRes } from "@/interfaces";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ErrorRes = ({ error }: { error?: any }) => {
  const err = error as APIRes
  const message = err?.message || "Please try again later";
  const code = err?.statusCode || 500;
  const pathname = usePathname();
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="p-8 w-full max-w-lg">
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-2xl text-primary font-semibold mb-2">
              Failed to load data
            </p>
            <p className="text-5xl font-bold text-destructive">{code}</p>
            <p className="text-lg text-muted-foreground">{message}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                window.location.href = pathname;
              }}
              variant="outline"
              size="lg"
              className="group border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-main hover:bg-main/90 text-white shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 transition-all duration-300"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorRes;
