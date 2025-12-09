import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/components/providers/session-provider";
import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";
import PersistAuth from "@/components/providers/persist-auth";
import { CartProvider } from "@/context/CartContext";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans`}>
        <SessionProvider>
          <PersistAuth>
            <CartProvider>
              <main className="min-h-screen">{children}</main>
              <Toaster
                toastOptions={{
                  closeButton: true,
                }}
                richColors
                icons={{
                  success: <CheckCircle2 className="h-5 w-5" />,
                  error: <X className="h-5 w-5" />,
                  warning: <AlertCircle className="h-5 w-5" />,
                  info: <Info className="h-5 w-5" />,
                }}
              />
            </CartProvider>
          </PersistAuth>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
