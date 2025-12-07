import Navbar from "@/app/(root)/_components/navbar/navbar";
import { Footer } from "./_components/footer/footer";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        {/* <hr className="mb-4 bg-gray-200" /> */}
        <Footer />
    </>
  );
};

export default RootLayout;
