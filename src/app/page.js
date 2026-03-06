import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import CalculatorClient from "@/components/CalculatorClient";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SkeletonLoader />}>
        <CalculatorClient />
      </Suspense>
    </ErrorBoundary>
  );
}
