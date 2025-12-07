import { ReactNode } from "react";
import Navbar from "@/app/(root)/_components/navbar/navbar";

const CheckoutLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default CheckoutLayout;
