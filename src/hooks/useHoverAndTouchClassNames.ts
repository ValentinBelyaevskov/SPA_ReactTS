import { useEffect, useState } from "react"



export const useHoverAndTouchClassNames = () => {
   const [hoverClassName, setHoverClassName] = useState<string>("");
   const [touchClassName, setTouchClassName] = useState<string>("");
   const [touchHappend, setTouchHappend] = useState<boolean>(false);
   const [className, setClassName] = useState<string>(`${hoverClassName} ${touchClassName}`);
   const [resetTouchClassNameTimeout, setResetTouchClassNameTimeout] = useState<NodeJS.Timeout | null>(null);



   const resetTouchClassName = (makeTimeout: boolean): void => {
      if (resetTouchClassNameTimeout) clearTimeout(resetTouchClassNameTimeout);

      setResetTouchClassNameTimeout(null);
      setTouchClassName("");

      if (makeTimeout) {
         const timeout = setTimeout(() => { setTouchHappend(false) }, 300);
         setResetTouchClassNameTimeout(timeout);
      }
   }



   useEffect(() => {
      setClassName(`${hoverClassName} ${touchClassName}`);
   }, [touchClassName, hoverClassName]);


   useEffect(() => {
      if (touchClassName) {
         setTouchHappend(true);
      }
   }, [touchClassName]);


   useEffect(() => {
      if (touchHappend && hoverClassName !== "") {
         setHoverClassName("");
      }
   }, [touchHappend, hoverClassName]);



   return {
      className,
      setHoverClassName,
      setTouchClassName,
      resetTouchClassName
   }
}