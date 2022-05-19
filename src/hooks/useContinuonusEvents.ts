import { useState, useEffect, useCallback } from 'react';


type ContinuousEvent = Event | undefined;

type EventName = "touchmove" | "touchstart" | "scroll" | "click";

type Callback = () => void;


export const useContinuonusEvents = (eventNames: EventName[], callback: Callback, elemClassNames?: string[]) => {
   const [event, setEvent] = useState<ContinuousEvent>(undefined);
   const [eventHappened, setEventHappened] = useState<boolean>(false);
   const [callbackNeedsToBeCalled, setCallbackNeedsToBeCalled] = useState<boolean>(true);



   const eventListener = useCallback((e: ContinuousEvent): void => {
      setEvent(e);

      if (elemClassNames && elementIsAnException(e, elemClassNames)) return;

      setEventHappened(true);
   }, [])

   const elementIsAnException = (e: ContinuousEvent, elemClassNames: string[],): boolean => (
      Boolean(elemClassNames.find(className => {
         return (e?.target instanceof HTMLElement)
            ? e?.target.closest(className)
            : false
      }))
   )

   const addEventListener = (): void => {
      eventNames.forEach(eventName => {
         window.addEventListener(eventName, eventListener);
      });
      setCallbackNeedsToBeCalled(true);
      setEventHappened(false);
   }

   const removeEventListener = (): void => {
      eventNames.forEach(eventName => {
         window.removeEventListener(eventName, eventListener);
      });
   }

   const enableEventSimulation = (): void => {
      setEventHappened(true);
      setCallbackNeedsToBeCalled(false);
   }



   useEffect(() => {
      if (eventHappened) {
         if (callbackNeedsToBeCalled) { callback() };
         removeEventListener();
      }

      return () => {
         setEventHappened(false);
         setCallbackNeedsToBeCalled(true)
      }
   }, [eventHappened, callbackNeedsToBeCalled]);



   return {
      event,
      setEvent,
      eventHappened,
      setEventHappened,
      enableEventSimulation,
      eventListener,
      addEventListener,
      removeEventListener,
   };
}