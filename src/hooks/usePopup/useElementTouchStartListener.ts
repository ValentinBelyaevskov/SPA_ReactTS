import { useState } from 'react';
import { useContinuonusEvents } from '../useContinuonusEvents';
import { useHoverAndTouchClassNames } from '../useHoverAndTouchClassNames';
import { Popup } from './usePopupElement';



export const useElementTouchStartListener = (popupObject: Popup, touchClassname: string, hoverClassname: string, touchExceptionClassname: string) => {
   const elementHoverAndTouchClassNames = useHoverAndTouchClassNames();
   const [showElementOnTouchStart, setShowElementOnTouchStart] = useState<boolean>(true);
   const [hideElementOnTouchTimeout, setHideElementOnTouchTimeout] = useState<NodeJS.Timeout | null>(null);
   const touchMove = useContinuonusEvents('touchmove', resetShowElementOnTouchEvent, [touchExceptionClassname]);
   const touchStart = useContinuonusEvents('touchstart', resetShowElementOnTouchEvent, [touchExceptionClassname]);



   const enableTouchEventsSimulation = (): void => {
      touchMove.enableEventSimulation();
      touchStart.enableEventSimulation();
   }

   function resetShowElementOnTouchEvent(): void {
      popupObject.hideElementWithTimeout(0);
      setShowElementOnTouchStart(true);
   }

   const addTouchEventListeners = (): void => {
      touchMove.removeEventListener();
      touchMove.addEventListener();
      touchStart.removeEventListener();
      touchStart.addEventListener();
   }

   const showElementOnTouch = (): void => {
      popupObject.showElementWithTimeout(0);
      setShowElementOnTouchStart(false);
      addTouchEventListeners();
   }

   const hideElementOnTouch = (): void => {
      popupObject.hideElementWithTimeout(0);
      setShowElementOnTouchStart(true);
      enableTouchEventsSimulation();
   }

   const setNewHideElementOnTouchTimeout = () => {
      if (hideElementOnTouchTimeout) clearTimeout(hideElementOnTouchTimeout);

      const timeout = setTimeout(() => {
         hideElementOnTouch();
      }, 2000);

      setHideElementOnTouchTimeout(timeout);
   }

   const elementTouchStartListener = (): void => {
      elementHoverAndTouchClassNames.setTouchClassName(touchClassname);


      if (showElementOnTouchStart) {
         showElementOnTouch();
         setNewHideElementOnTouchTimeout();
      } else {
         hideElementOnTouch();
      }
   }

   return {
      elementTouchStartListener,
      enableTouchEventsSimulation,
      setShowElementOnTouchStart,
      elementHoverAndTouchClassName: elementHoverAndTouchClassNames.className,
      setElementHoverClassName: () => elementHoverAndTouchClassNames.setHoverClassName(hoverClassname),
      resetElementHoverClassName: () => elementHoverAndTouchClassNames.setHoverClassName(""),
      resetElementTouchClassName: (makeTimeot: boolean) => elementHoverAndTouchClassNames.resetTouchClassName(makeTimeot),
      resetShowElementOnTouchEvent
   }
}