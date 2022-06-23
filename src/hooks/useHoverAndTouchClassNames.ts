import { useEffect, useState } from "react"




export const useHoverAndTouchClassNames = (hoverClassName: string, touchClassName: string) => {
   const [hoverClassNameValue, setHoverClassNameValue] = useState<string>(hoverClassName);
   const [touchClassNameValue, setTouchClassNameValue] = useState<string>("");
   const [touchHappened, setTouchHappened] = useState<boolean>(false);
   const [className, setClassName] = useState<string>(`${hoverClassNameValue} ${touchClassNameValue}`);


   // ! 1)
   // * При "первом" касании элемента (когда перед касанием этого элемента были касания до дргуих) происходит
   // * событие mouseEnter (после touchEnd).
   // * touchEnd устанавливает touchHappened = false спустя время, что бы эффект "2)" обнулил hoverClassNameValue


   const clickListener = () => {
      setTouchHappened(false);
   }

   const mouseEnterListener = () => {
      setHoverClassNameValue(hoverClassName);
   }

   const touchStartListener = () => {
      setHoverClassNameValue("");
      setTouchClassNameValue(touchClassName);
   }

   const touchEndListener = () => {
      setTouchClassNameValue("");
   }

   const resetHoverClassName = () => setHoverClassNameValue("");




   useEffect(() => {
      setClassName(`${hoverClassNameValue} ${touchClassNameValue}`);
   }, [touchClassNameValue, hoverClassNameValue])


   useEffect(() => {
      if (touchClassNameValue) {
         setTouchHappened(true);
      }
   }, [touchClassNameValue])


   useEffect(() => {
      // ! 2)
      if (touchHappened && hoverClassNameValue !== "") {
         setHoverClassNameValue("");
         setTouchHappened(false);
      }
   }, [touchHappened, hoverClassNameValue])




   return {
      className,
      clickListener,
      mouseEnterListener,
      touchStartListener,
      touchEndListener,
      resetHoverClassName
   }
}