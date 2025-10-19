import Image from "next/image";
import Link from "next/link";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 mx-auto">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 self-center font-medium"
        >
          <Image src="/images/logo.svg" alt="Weava" width={40} height={40} />
          <span className="text-lg font-semibold">Weava</span>
        </Link>

        {/* Form Section */}
        {children}
      </div>
    </div>
  );
};

export default layout;
