import { useState, useEffect } from 'react';
import { AppStyle } from "types/types";
import getValueWithoutMeasurer from '../../functions/getValueWithoutMeasurer';
import { useWindowSize } from 'hooks/useWindowSize';
import { useSetAppPaddinRight } from './useSetAppPaddinRight';


type Elements = {
   appElem: HTMLDivElement,
   pagesContainerElem: HTMLDivElement,
   headerContainerElem: HTMLDivElement,
   sidebarsContainerElem: HTMLDivElement,
}


export const useAppScrollSetting = (needToShowPopup: boolean, needToShowBackground: boolean, elements: Elements, showPreloader: boolean) => {
   const resize = useWindowSize("resize");
   const [appStyle, setAppStyle] = useState<AppStyle>({});
   const [fullAppHeight, setFullAppHeight] = useState<number>(0);
   const [scrollTop, setScrollTop] = useState<number>(0);
   const [cancelAppScrollStylesCalled, setCancelAppScrollStylesCalled] = useState<boolean>(false);



   const cancelAppScrollStyles = (windowHeight: number, scroll: number) => {
      if (!cancelAppScrollStylesCalled) setCancelAppScrollStylesCalled(true);
      setAppStyle({ overflow: "hidden", height: `${windowHeight + scroll}px`, marginTop: `${-scroll}px` });
   }

   const applyAppScrollStyles = (): void => {
      elements.appElem.style.marginTop = "0";
      elements.appElem.style.height = "auto";
      elements.appElem.style.overflowY = "auto";
   }

   const resetAppStylesAndScroll = (): void => {
      setAppStyle({});
      setScrollTop(0);
   }

   const enableAppScroll = (scrollTop: number): void => {
      setTimeout(() => applyAppScrollStyles(), 0);
      setTimeout(() => { document.documentElement.scrollTop = scrollTop }, 0);
      setTimeout(resetAppStylesAndScroll, 0);
   }

   const getFullAppHeight = (appElement: HTMLDivElement, windowWidth: number): number => {
      const headerHeight: number = windowWidth <= 460 ?
         53
         : 48;

      return +getValueWithoutMeasurer(getComputedStyle(appElement).height) + headerHeight
   }

   const getWindowHeight = (windowHeight: number): number => (
      window.innerHeight === windowHeight ?
         windowHeight
         : window.innerHeight
   )

   const getAppScroll = (windowHeight: number, fullAppHeight: number, scrollTop: number): number => (
      fullAppHeight < (windowHeight + scrollTop) ?
         (scrollTop > (windowHeight + scrollTop - fullAppHeight) ?
            scrollTop - (windowHeight + scrollTop - fullAppHeight)
            : 0)
         : scrollTop
   )



   useSetAppPaddinRight(elements, resize, cancelAppScrollStylesCalled);


   useEffect(() => {
      resize.addEventListener();

      return () => resize.removeEventListener();
   }, []);


   useEffect(() => {
      if (needToShowPopup) {
         setScrollTop(document.documentElement.scrollTop)
      }
   }, [needToShowPopup]);


   useEffect(() => {
      if (!needToShowPopup && !needToShowBackground && elements.appElem) {
         setCancelAppScrollStylesCalled(false);
         enableAppScroll(scrollTop);
      }
   }, [needToShowPopup, needToShowBackground, elements.appElem]);


   useEffect(() => {
      if (elements.pagesContainerElem) {
         setFullAppHeight(getFullAppHeight(elements.pagesContainerElem, resize.value[0]))
      }
   }, [needToShowPopup, resize.value, elements.pagesContainerElem]);


   useEffect(() => {
      if (needToShowPopup && ((scrollTop === document.documentElement.scrollTop) || cancelAppScrollStylesCalled)) {
         const windowHeight: number = getWindowHeight(resize.value[1]);
         const scroll: number = getAppScroll(windowHeight, fullAppHeight, scrollTop)

         cancelAppScrollStyles(windowHeight, scroll);
      }
   }, [needToShowPopup, scrollTop, resize.value, cancelAppScrollStylesCalled, fullAppHeight]);


   useEffect(() => {
      if (!showPreloader && elements.appElem) {
         elements.appElem.style.position = "relative"
      }
   }, [showPreloader])



   return appStyle
}