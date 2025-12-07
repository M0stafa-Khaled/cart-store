"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="w-full flex flex-col md:flex-row items-center px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col items-center justify-center w-full md:w-1/2 md:min-h-screen bg-[#FFEDE1] py-3 md:border-r"
        >
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
            Welcome to <span className=" text-main">Cart Store</span>
          </h1>
          <Image
            src={"/auth.png"}
            alt=""
            width={400}
            height={400}
            loading="eager"
            className="w-3xs md:w-md"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full  md:w-1/2 my-10 md:my-0"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
