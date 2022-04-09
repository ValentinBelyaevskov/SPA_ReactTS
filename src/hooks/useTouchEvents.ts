import { useState, useEffect, useCallback } from 'react';


type Event = React.TouchEvent | undefined | TouchEvent;

type EventName = "touchmove" | "touchstart";

type Callback = () => void;


export const useTouchEvents = (eventName: EventName, elemClassNames: string[], callback: Callback) => {
   // consts
   const [event, setEvent] = useState<Event>(undefined);
   const [eventHappened, setEventHappened] = useState<boolean>(false);
   const [callbackNeedsToBeCalled, setCallbackNeedsToBeCalled] = useState<boolean>(true);


   // functions
   const eventListener = useCallback((e: Event): void => {
      setEvent(e);

      if (elementIsAnException(e, elemClassNames)) return;

      if (!event) setEventHappened(true);
   }, []);

   const elementIsAnException = (e: Event, elemClassNames: string[],): boolean => (
      Boolean(elemClassNames.find(className => {
         return (e?.target instanceof HTMLElement)
            ? e?.target.closest(className)
            : false
      }))
   )

   const addEventListener = (): void => {
      console.log("addEventListener")
      document.documentElement.addEventListener(eventName, eventListener);
   }

   const removeEventListener = (): void => {
      console.log("removeEventListener")
      document.documentElement.removeEventListener(eventName, eventListener);
   }

   const enableEventSimulation = (): void => {
      setEventHappened(true);
      setCallbackNeedsToBeCalled(false);
   }


   // effects
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