import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function useQueryHandler(fn, options = {}) {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryFn: () => fn(options.query),
    queryKey: options.queryKey,
    refetchOnReconnect: false,
    staleTime: options?.staleTime ?? Infinity, // in dev, change for prod use as suitable
  });
  useEffect(() => {
    if (error?.response?.data?.data?.error_type === "TRIAL_EXPIRED") {
      router.push("/subscription");
    }
  }, [error, router]);
  return { data, isLoading, error };
}
export default useQueryHandler;
