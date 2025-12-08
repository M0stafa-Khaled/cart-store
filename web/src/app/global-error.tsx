"use client";

import ErrorPage from "@/components/shared/error-page";

const GlobalError = ({ error }: { error: Error & { digest?: string } }) => {
  return (
    <html>
      <body>
        <ErrorPage
          error={{
            message: error?.message,
            code: 500,
          }}
        />
      </body>
    </html>
  );
};

export default GlobalError;
