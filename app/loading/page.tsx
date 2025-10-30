/**
 * OPS Loading Page
 * Award-winning loading experience for the application
 * Created: October 30, 2025
 */

"use client";

import { useRouter } from "next/navigation";
import {
  PremiumLoader,
  useLoadingState,
} from "../../components/loading/PremiumLoader";

export default function LoadingPage() {
  const router = useRouter();
  const { isLoading, finishLoading } = useLoadingState(true);

  const handleLoadingComplete = () => {
    finishLoading();
    // Redirect to main page after loading
    setTimeout(() => {
      router.push("/");
    }, 300);
  };

  return (
    <>
      {isLoading && (
        <PremiumLoader
          onComplete={handleLoadingComplete}
          duration={3500} // 3.5 seconds for full experience
        />
      )}
    </>
  );
}
