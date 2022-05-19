import { WindowSize } from "hooks/useWindowSize";
import { useEffect, useState } from "react";


type Elements = {
   appElem: HTMLDivElement,
   pagesContainerElem: HTMLDivElement,
   headerContainerElem: HTMLDivElement,
   sidebarsContainerElem: HTMLDivElement
}


export const useSetAppPaddinRight = (elements: Elements, resize: WindowSize, cancelAppScroll: boolean) => {
   // ?           setAppPaddingRight
   const [scrollHasBeenSet, setScrollHasBeenSet] = useState<boolean>(false);
   const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);


   const setScrollStyle = (appElement: HTMLDivElement) => {
      appElement.style.height = "101vh";
      appElement.style.position = "relative";
   }

   const setAppHeightAuto = () => {
      elements.appElem.style.height = "auto";
   }

   const setDefaultScrollStyle = (elements: Elements, scrollbarWidth: number, windowWidth: number) => {
      const pageElem: HTMLDivElement | null = document.querySelector(".page")
      const pagePartElem: HTMLDivElement | null = document.querySelector(".pagePart")

      if (
         pageElem
         && pagePartElem
         && elements.headerContainerElem
         && elements.pagesContainerElem
         && elements.sidebarsContainerElem
      ) {

         if (windowWidth <= 750) {
            pageElem.style.width = "100vw";
            pagePartElem.style.paddingRight = `${20 + scrollbarWidth}px`;

            elements.headerContainerElem.style.paddingRight = `${scrollbarWidth}px`
            elements.pagesContainerElem.style.paddingRight = `${scrollbarWidth}px`
            elements.sidebarsContainerElem.style.paddingRight = `${scrollbarWidth}px`
         } else {
            pageElem.style.width = "auto";
            pagePartElem.style.paddingRight = `20px`;

            elements.headerContainerElem.style.paddingRight = `0px`
            elements.pagesContainerElem.style.paddingRight = `0px`
            elements.sidebarsContainerElem.style.paddingRight = `0px`
         }
      }
   }



   useEffect(() => {
      if (
         elements.appElem
         && elements.headerContainerElem
         && elements.pagesContainerElem
         && elements.sidebarsContainerElem
         && !scrollHasBeenSet
      ) {
         setScrollStyle(elements.appElem);
         setScrollHasBeenSet(true);
         setScrollbarWidth(window.innerWidth - document.documentElement.clientWidth)
      }
   }, [elements.appElem, elements.headerContainerElem, elements.pagesContainerElem, elements.sidebarsContainerElem])

   useEffect(() => {
      if (scrollHasBeenSet && elements) {
         setDefaultScrollStyle(elements, scrollbarWidth, resize.value[0]);
      }
   }, [elements, scrollHasBeenSet, scrollbarWidth, resize.value[0]])

   useEffect(() => {
      if (!cancelAppScroll && scrollHasBeenSet && elements) {
         setAppHeightAuto();
      }
   }, [cancelAppScroll, scrollHasBeenSet, scrollbarWidth, resize.value[0]])
}