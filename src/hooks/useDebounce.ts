import { useState, useCallback } from 'react';



type Callback = (...args: any) => any



export const useDebounce = (callback: Callback, delay: number): Callback => {
   const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);



   const debouncedFunction = useCallback((...args) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);

      const timeout = setTimeout(async () => {
         await callback.apply(this, args);
         setDebounceTimeout(null);
      }, delay);

      setDebounceTimeout(timeout);
   }, [callback, debounceTimeout, delay]);



   return debouncedFunction;
}