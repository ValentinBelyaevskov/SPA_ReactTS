import { useCallback, useEffect, useState } from "react"


type Size = [number, number]


export const useGetWindowSizeOnOrientationChange = () => {
   const [windowOrientation, setWindowOrientation] = useState<Number>(0);
   const [windowSize, setWindowSize] = useState<Size>([window.innerWidth, window.innerHeight]);
   const [windowScroll, setWindowScroll] = useState<Size>([document.documentElement.scrollLeft, document.documentElement.scrollTop]);

   const orientationChangeListener = useCallback(() => {
      console.log("window.orientation: ", window.orientation)
   }, [])



   useEffect(() => {
      window.addEventListener("orientationchange", orientationChangeListener)

      return () => {
         window.removeEventListener("orientationchange", orientationChangeListener)
      }
   }, []);

   useEffect(() => {
      
   }, [windowOrientation])
}