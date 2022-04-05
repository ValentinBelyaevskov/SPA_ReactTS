import { useState, useEffect, useCallback } from 'react';


export const useWindowsSize = (maxWidth: number) => {
   // consts
   const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);


   // functions
   const resizeListener = (): void => setWindowSize([window.innerWidth, window.innerHeight]);

   const addResizeListener = useCallback(
      (): void => {
         window.addEventListener("resize", resizeListener);
      }
      , []
   );

   const removeResizeListener = useCallback(
      (): void => {
         window.removeEventListener("resize", resizeListener);
      }
      , []
   );


   // effects
   useEffect(() => {
      if (windowSize[0] > maxWidth) removeResizeListener();
   }, [windowSize]);


   return { windowSize, addResizeListener, removeResizeListener };
}