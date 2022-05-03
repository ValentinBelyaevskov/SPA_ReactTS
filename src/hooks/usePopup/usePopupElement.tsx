import { useState, useEffect, useCallback } from 'react';
import React from 'react';



export type Popup = {
   needToShowElement: boolean
   setContentLoaded: React.Dispatch<React.SetStateAction<boolean>>
   showElementWithTimeout: (timeValue: number) => void
   hideElementWithTimeout: (timeValue: number) => void
   hideElementWithoutAnimation: () => void
}



export const usePopupElement = (elementRef: React.RefObject<HTMLDivElement>, expectContentToLoad?: boolean): Popup => {
   const [needToShowElement, setNeedToShowElement] = useState<boolean>(false);
   const [contentLoaded, setContentLoaded] = useState<boolean>(false);
   const [isThereAnHiddingEndListener, setIsThereAnHiddingEndListener] = useState<boolean>(false);
   const [thereIsAZeroHideTimeout, setThereIsAZeroHideTimeout] = useState<boolean>(false);
   const [theElementWillBeHidden, setTheElementWillBeHidden] = useState<boolean>(false);
   const [hiddingTimeotValue, setHiddingTimeoutValue] = useState<null | NodeJS.Timeout>(null);
   const [showElementTimeoutValue, setShowElementTimeoutValue] = useState<null | NodeJS.Timeout>(null);



   // * Если не нужно ждать загрузки контента - contentLoaded: true;
   useEffect(() => {
      if (needToShowElement && !expectContentToLoad) {
         setContentLoaded(true);
      }
   }, [needToShowElement, expectContentToLoad])

   // * Если элемент готов к появлению - смена opacity с 0 на 1
   // * Если элемент надо скрыть - смена opacity с 1 на 0
   // * Перед новым render  удалить timeout
   useEffect(() => {
      if (!elementRef.current) return

      let timeout: any

      if (needToShowElement && contentLoaded && !isThereAnHiddingEndListener) {
         timeout = setTimeout(() => {
            elementRef.current!.style.opacity = "1";
         }, 20)
      } else if (isThereAnHiddingEndListener) {
         timeout = setTimeout(() => {
            elementRef.current!.style.opacity = "0";
         }, 0, true)
      }

      return () => {
         clearTimeout(timeout)
      }
   }, [needToShowElement, contentLoaded, isThereAnHiddingEndListener])

   // * Если элемент не нужно скрывать, тогда нужно удалить timeout с вызовом hideElement()
   useEffect(() => {
      if (!theElementWillBeHidden && hiddingTimeotValue) setHiddingTimeotValueFalse();
   }, [hiddingTimeotValue, theElementWillBeHidden])



   const setHiddingTimeotValueFalse = (): void => {
      if (hiddingTimeotValue) clearTimeout(hiddingTimeotValue);
      setHiddingTimeoutValue(null);
   }

   const setShowElementTimeoutValueFalse = (): void => {
      if (showElementTimeoutValue) clearTimeout(showElementTimeoutValue);
      setShowElementTimeoutValue(null);
   }

   const hiddingEndListener = useCallback((e: TransitionEvent): void => {
      if (e.target !== e.currentTarget) return;
      setNeedToShowElement(false);
      setContentLoaded(false);
      setIsThereAnHiddingEndListener(false);
   }, [])

   const showElement = (callbackToSetShowStatus: (status: boolean) => void): void => {
      callbackToSetShowStatus(true);
      setTheElementWillBeHidden(false);
      setIsThereAnHiddingEndListener(false);
      setThereIsAZeroHideTimeout(false);
      setShowElementTimeoutValueFalse();
   }

   const hideElement = (ref: React.RefObject<HTMLDivElement>): void => {
      setIsThereAnHiddingEndListener(true);

      if (ref.current) {
         const currentOpacity = getComputedStyle(ref.current!).opacity;
         ref.current!.style.opacity = currentOpacity;
      }
   }

   const showElementWithTimeout = (timeValue: number): void => {
      const time = !needToShowElement ? timeValue : 0;
      const timeout = setTimeout(() => {
         showElement(setNeedToShowElement);
         if (elementRef.current) elementRef.current.removeEventListener("transitionend", hiddingEndListener);
      }, time);
      setShowElementTimeoutValue(timeout);
   }

   const hideElementWithTimeout = (timeValue: number): void => {
      if (
         ((!timeValue && thereIsAZeroHideTimeout)
            || (timeValue && theElementWillBeHidden))
         && !showElementTimeoutValue
      ) return;

      if (!timeValue) setThereIsAZeroHideTimeout(true);
      setTheElementWillBeHidden(true);

      const time = needToShowElement ? timeValue : 0
      const timeout = setTimeout(() => {
         if (showElementTimeoutValue) setShowElementTimeoutValueFalse();
         if (elementRef.current) {
            elementRef.current.addEventListener("transitionend", hiddingEndListener);
            hideElement(elementRef);
         }
      }, time)
      setHiddingTimeoutValue(timeout)
   }

   const hideElementWithoutAnimation = (): void => {
      if (elementRef.current) {
         elementRef.current!.style.opacity = "0";
         setNeedToShowElement(false);
         setContentLoaded(false);
         setIsThereAnHiddingEndListener(false);
      }
   }



   return {
      needToShowElement,
      setContentLoaded,
      showElementWithTimeout,
      hideElementWithTimeout,
      hideElementWithoutAnimation
   }
}