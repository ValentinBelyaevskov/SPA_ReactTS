import { useState, useEffect, useCallback } from 'react';
import { useThrottle } from './useThrottle';



type Size = [number, number]

type EventName = "resize" | "scroll"

export type WindowSize = {
   value: any,
   addEventListener: () => void,
   removeEventListener: () => void,
}



export const useWindowSize = (eventName: EventName, maxWidth?: number, listenerRemovalCondition?: boolean) => {
   const [unthrottledValue, setUnthrottledValue] = useState<Size | null>(null);
   const value = useThrottle<Size>(unthrottledValue, setUnthrottledValue, 150, getValue(eventName));



   function getValue(eventName: string): Size | null {
      return eventName === 'resize' ?
         [window.innerWidth, window.innerHeight]
         : eventName === 'scroll' ?
            [document.documentElement.scrollLeft, document.documentElement.scrollTop]
            : null;
   }

   const eventListener = useCallback((): void => {
      setUnthrottledValue(getValue(eventName));
   }, [eventName]);

   const addEventListener = (): void => {
      window.addEventListener(eventName, eventListener);
   }

   const removeEventListener = (): void => {
      window.removeEventListener(eventName, eventListener);
   }



   useEffect(() => {
      if (listenerRemovalCondition || (maxWidth && (value[0] > maxWidth))) {
         console.log("removeEventListener()", Boolean(listenerRemovalCondition), Boolean());
         removeEventListener();
      };
   }, [value]);



   return { value, addEventListener, removeEventListener };
}