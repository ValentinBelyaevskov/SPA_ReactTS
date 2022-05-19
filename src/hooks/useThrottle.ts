import { useEffect, useState } from "react";



export const useThrottle = <Value>(unthrottledValue: any, setUnthrottledValue: React.Dispatch<React.SetStateAction<any>>, delay: number, defaultValue: any): Value => {
   const [value, setValue] = useState<any>(defaultValue);
   const [isWaiting, setIsWaiting] = useState<boolean>(false);



   useEffect(() => {
      if (isWaiting || !unthrottledValue) return

      setIsWaiting(true);
      setValue(unthrottledValue);

      setTimeout(() => {
         setIsWaiting(false);
         setUnthrottledValue(null);
      }, delay);
   }, [isWaiting, unthrottledValue]);



   return value
}