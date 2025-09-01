import { useEffect, useRef } from "react";

export function useDebounce(fn, delay) {
  const timeoutRef = useRef();
  const callbackRef = useRef(fn);

  useEffect(() => {
    callbackRef.current = fn;
  }, [fn]);

  function debouncedFn(...args) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }

  return debouncedFn;
}
