import { useQuery } from "@tanstack/react-query";
function useQueryHandler(fn, options = {}) {
  const { data, isLoading, error } = useQuery({
    queryFn: () => fn(options.query),
    queryKey: options.queryKey,
    refetchOnReconnect: false,
    staleTime: options?.staleTime ?? Infinity, // in dev, change for prod use as suitable
  });
  return { data, isLoading, error };
}
export default useQueryHandler;
