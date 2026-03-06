"use client";

import dynamic from "next/dynamic";
import SkeletonLoader from "./SkeletonLoader";

const RetirementCalculator = dynamic(
  () => import("./RetirementCalculator"),
  { ssr: false, loading: () => <SkeletonLoader /> }
);

export default function CalculatorClient() {
  return <RetirementCalculator />;
}