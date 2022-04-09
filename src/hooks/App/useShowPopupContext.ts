import { useWindowsSize } from 'hooks/useWindowsSize';
import { useState, useEffect } from 'react';
import { AppStyle } from "types/types";
import React from 'react';
import getValueWithoutMeasurer from '../../functions/getValueWithoutMeasurer';


export const useShowPopupContext = (needToShowPopup: boolean, appRef: React.RefObject<HTMLDivElement>, pagesRef: React.RefObject<HTMLDivElement>) => {
   // consts
   const [appStyle, setAppStyle] = useState<AppStyle>({});
   const [fullAppHeight, setFullAppHeight] = useState<number>(0)
   const [scrollTop, setScrollTop] = useState<number>(0)
   const { windowSize, addResizeListener, removeResizeListener } = useWindowsSize();
   const [cancelAppScrollStylesCalled, setShowAppCalled] = useState<boolean>(false);


   // functions
   const cancelAppScrollStyles = (windowHeight: number, scroll: number) => {
      if (!cancelAppScrollStylesCalled) setShowAppCalled(true);
      setAppStyle({ overflow: "hidden", height: `${windowHeight + scroll}px`, marginTop: `${-scroll}px` });
   }

   const applyAppScrollStyles = (): void => {
      appRef.current!.style.marginTop = "0";
      appRef.current!.style.height = "auto";
      appRef.current!.style.overflow = "auto";
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

   const getFullAppHeight = (appElement: HTMLDivElement, windowSize: number[]): number => {
      const headerHeight: number = windowSize[0] <= 460 ?
         53
         : 48;

      return +getValueWithoutMeasurer(getComputedStyle(appElement).height) + headerHeight
   }

   const getWindowHeight = (windowSize: number[]): number => (
      window.innerHeight === windowSize[1] ?
         windowSize[1]
         : window.innerHeight
   )

   const getAppScroll = (windowHeight: number, fullAppHeight: number, scrollTop: number): number => (
      fullAppHeight < (windowHeight + scrollTop) ?
         (scrollTop > (windowHeight + scrollTop - fullAppHeight) ?
            scrollTop - (windowHeight + scrollTop - fullAppHeight)
            : 0)
         : scrollTop
   )


   // effects
   useEffect(() => {
      if (needToShowPopup) {
         addResizeListener();
         setScrollTop(document.documentElement.scrollTop)
      } else {
         setShowAppCalled(false)
         removeResizeListener();
         enableAppScroll(scrollTop)
      }
   }, [needToShowPopup]);

   useEffect(() => {
      setFullAppHeight(getFullAppHeight(pagesRef.current!, windowSize))
   }, [needToShowPopup, windowSize])

   useEffect(() => {
      if (needToShowPopup && ((scrollTop === document.documentElement.scrollTop) || cancelAppScrollStylesCalled)) {
         const windowHeight: number = getWindowHeight(windowSize);
         const scroll: number = getAppScroll(windowHeight, fullAppHeight, scrollTop)

         cancelAppScrollStyles(windowHeight, scroll);
      }
   }, [needToShowPopup, scrollTop, windowSize, cancelAppScrollStylesCalled, fullAppHeight]);

   return { appStyle }
}