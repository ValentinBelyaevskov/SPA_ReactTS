import getValueWithoutMeasure from "functions/getValueWithoutMeasure";
import { useScrollOrWindowSize } from "hooks/useScrollOrWindowSize";
import { useEffect, useState } from 'react';



export const useDropdownHeader = (needToShowControls: boolean, headerElement: HTMLDivElement, appElement: HTMLDivElement) => {
   const resize = useScrollOrWindowSize("resize");
   const scroll = useScrollOrWindowSize("scroll");
   const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
   const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
   // * правильно реагировать на resize для sidebar



   const getElementStyle = (element: HTMLDivElement) => getComputedStyle(element)



   useEffect(() => {
      resize.addEventListener();

      return () => {
         resize.removeEventListener();
      }
   }, []);


   useEffect(() => {
      if (scroll.value[1] > prevScrollTop) {
         setScrollDirection("down");
      } else if (scroll.value[1] < prevScrollTop) {
         setScrollDirection("up");
      }

      if (!needToShowControls) setPrevScrollTop(scroll.value[1]);
   }, [scroll.value[1], prevScrollTop, needToShowControls])


   useEffect(() => {
      if (headerElement) {
         const headerHeight = +getValueWithoutMeasure(getElementStyle(headerElement).height);

         if (resize.value[0] > 600) {
            headerElement.style.transform = `translateY(-${0}px)`;
            return
         }
         if (scrollDirection === "down" && (scroll.value[1] > headerHeight + 5) && scroll.value[1] !== prevScrollTop) {
            headerElement.style.transform = `translateY(-${headerHeight + 5}px)`;
         } else if (scrollDirection === "up") {
            headerElement.style.transform = `translateY(${0}px)`;
         }
      }
   }, [scroll.value[1], prevScrollTop, scrollDirection, headerElement, resize.value[0]])


   useEffect(() => {
      if (resize.value[0] > 600) return

      if (appElement && headerElement) {
         scroll.addEventListener();
      }

      return () => {
         scroll.removeEventListener();
      }
   }, [appElement, headerElement, scroll.value[1], prevScrollTop, resize.value[0]])
}






// * showSidebar function
   // const getElementWindowCoords = (element: HTMLDivElement) => element.getBoundingClientRect()

   // * sidebar useEffect
   // useEffect(() => {
   //    const header = headerRef.current!;
   //    const headerY = getElementWindowCoords(header).y;
   //    const headerHeight = +getValueWithoutMeasure(getElementStyle(header).height);

   //    if (scrollDirection === "down" && !controlsContext.needToShowControls) {
   //       if (!headerY) {
   //          header.style.position = "absolute";
   //          header.style.top = `${scroll.value[1]}px`;
   //       } else if (Math.abs(headerY) > (headerHeight + 5)) {
   //          header.style.position = "fixed";
   //          header.style.top = `-${headerHeight + 5}px`;
   //       }
   //    } else if (scrollDirection === "up"  && !controlsContext.needToShowControls) {
   //       if (headerY && (Math.abs(headerY) === headerHeight + 5)) {
   //          console.log("up");
   //          header.style.position = "absolute";
   //          header.style.top = `${document.documentElement.scrollTop - headerHeight}px`;
   //       } else if (headerY > 0) {
   //          header.style.position = "fixed";
   //          header.style.top = "0px";
   //       }
   //    }
   // }, [scroll.value[1], scrollDirection, headerRef, controlsContext.needToShowControls])