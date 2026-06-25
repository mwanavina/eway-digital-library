import { Suspense } from "react";
import CheckEmailPage from "./page.client";

export default function Page() {
  return (
    <Suspense>
      <CheckEmailPage />
    </Suspense>
  );
}
