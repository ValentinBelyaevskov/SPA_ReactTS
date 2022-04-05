import { useState, useEffect, useCallback } from 'react';
import React from 'react';


export type Popup = {
   needToShowElement: boolean
   setContentLoaded: React.Dispatch<React.SetStateAction<boolean>>
   showElementWithTimeout: (timeValue: number) => void
   hideElementWithTimeout: (timeValue: number) => void
}


export const usePopupElement = (elementRef: React.RefObject<HTMLDivElement>, expectContentToLoad?: boolean): Popup => {
   // consts
   const [needToShowElement, setNeedToShowElement] = useState<boolean>(false)
   const [contentLoaded, setContentLoaded] = useState<boolean>(false)
   const [isThereTransitionendListener, setIsThereTransitionendListener] = useState<boolean>(false)
   const [theElementWillBeHiddenLater, setTheElementWillBeHiddenLater] = useState<boolean>(false)
   const [hiddingTimeotValue, setHiddingTimeoutValue] = useState<null | NodeJS.Timeout>(null)
   const [showTimeotValue, setShowTimeoutValue] = useState<null | NodeJS.Timeout>(null)


   // effects
   useEffect(() => {
      if (needToShowElement && !expectContentToLoad) {
         setContentLoaded(true)
      }
   }, [needToShowElement, expectContentToLoad])

   useEffect(() => {
      if (!elementRef.current) return

      let timeout: any

      if (needToShowElement && contentLoaded && !isThereTransitionendListener) {
         timeout = setTimeout(() => {
            elementRef.current!.style.opacity = "1"
         }, 20)
      } else if (isThereTransitionendListener) {
         timeout = setTimeout(() => {
            elementRef.current!.style.opacity = "0"
         }, 0, true)
      }

      return () => {
         clearTimeout(timeout)
      }
   }, [needToShowElement, contentLoaded, isThereTransitionendListener])

   useEffect(() => {
      if (!theElementWillBeHiddenLater && hiddingTimeotValue) clearTimeout(hiddingTimeotValue)
   }, [hiddingTimeotValue, theElementWillBeHiddenLater])


   // funcs
   const transitionendListener = useCallback((e: TransitionEvent): void => {
      if (e.target !== e.currentTarget) return
      setNeedToShowElement(false)
      setContentLoaded(false)
      setIsThereTransitionendListener(false)
   }, [])

   const showElement = (callbackToSetShowStatus: (status: boolean) => void): void => {
      callbackToSetShowStatus(true)
      setTheElementWillBeHiddenLater(false)
      setIsThereTransitionendListener(false)
   }

   const hideElement = (ref: React.RefObject<HTMLDivElement>): void => {
      setIsThereTransitionendListener(true)

      if (ref.current) {
         const currentOpacity = getComputedStyle(ref.current!).opacity
         ref.current!.style.opacity = currentOpacity
      }
   }

   const showElementWithTimeout = (timeValue: number): void => {
      const time = !needToShowElement ? timeValue : 0
      const timeout = setTimeout(() => {
         showElement(setNeedToShowElement)
         if (elementRef.current) elementRef.current.removeEventListener("transitionend", transitionendListener)
      }, time)
      setShowTimeoutValue(timeout)
   }

   const hideElementWithTimeout = (timeValue: number): void => {
      setTheElementWillBeHiddenLater(true)
      const time = needToShowElement ? timeValue : 0
      const timeout = setTimeout(() => {
         if (showTimeotValue) clearTimeout(showTimeotValue)
         if (elementRef.current) {
            elementRef.current.addEventListener("transitionend", transitionendListener)
            hideElement(elementRef);
         }
      }, time)
      setHiddingTimeoutValue(timeout)
   }


   return {
      needToShowElement,
      setContentLoaded,
      showElementWithTimeout,
      hideElementWithTimeout,
   }
}