import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function useQueryParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setParams = (params) => {
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { pathname, router, params, setParams };
}

export default useQueryParams;
