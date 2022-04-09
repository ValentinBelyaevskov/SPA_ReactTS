import { useState, useEffect, useCallback } from 'react';


export const useWindowsSize = (maxWidth?: number, listenerRemovalCondition?: boolean) => {
   const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);


   // functions
   const resizeListener = useCallback((): void => {
      setWindowSize([window.innerWidth, window.innerHeight]);
   }, []);

   const addResizeListener = (): void => {
      window.addEventListener("resize", resizeListener);
   }

   const removeResizeListener = (): void => {
      window.removeEventListener("resize", resizeListener);
   }


   // effects
   useEffect(() => {
      if (listenerRemovalCondition || (maxWidth && (windowSize[0] > maxWidth))) {
         console.log("RemovalCondition")
         removeResizeListener();
      };
   }, [windowSize]);


   return { windowSize, addResizeListener, removeResizeListener };
}