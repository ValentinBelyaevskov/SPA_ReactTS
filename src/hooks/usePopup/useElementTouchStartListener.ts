import { useState } from 'react';
import { useContinuonusEvents } from '../useContinuonusEvents';
import { useHoverAndTouchClassNames } from '../useHoverAndTouchClassNames';
import { Popup } from './usePopupElement';



export const useElementTouchStartListener = (touchClassname: string, hoverClassname: string, touchExceptionClassname: string, popupObject: Popup, showAndHideTimeouts: [number, number]) => {
   const elementHoverAndTouchClassNames = useHoverAndTouchClassNames();
   const [showElementOnTouchStart, setShowElementOnTouchStart] = useState<boolean>(true);
   const [hideElementOnTouchTimeout, setHideElementOnTouchTimeout] = useState<NodeJS.Timeout | null>(null);
   const touchEvents = useContinuonusEvents(['touchstart', 'touchmove'], resetShowElementOnTouchEvent, [touchExceptionClassname]);



   function resetShowElementOnTouchEvent(): void {
      if (popupObject) popupObject.hideElementWithTimeout(0);

      setShowElementOnTouchStart(true);
   }

   const showElementOnTouch = (): void => {
      if (popupObject) popupObject.showElementWithTimeout(0);

      setShowElementOnTouchStart(false);
      touchEvents.addEventListener()
   }

   const hideElementOnTouch = (): void => {
      if (popupObject) popupObject.hideElementWithTimeout(0);

      setShowElementOnTouchStart(true);
      touchEvents.enableEventSimulation()
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

   const showElement = (): void => {
      popupObject.showElementWithTimeout(showAndHideTimeouts[0]);
      setShowElementOnTouchStart(false);
      elementHoverAndTouchClassNames.setHoverClassName(hoverClassname);
   }

   const hideElement = (): void => {
      popupObject.hideElementWithTimeout(showAndHideTimeouts[1]);
      setShowElementOnTouchStart(true);
      touchEvents.enableEventSimulation()
      elementHoverAndTouchClassNames.setHoverClassName("")
   }



   return {
      elementTouchStartListener,
      enableTouchEventsSimulation: touchEvents.enableEventSimulation,
      setShowElementOnTouchStart,
      elementHoverAndTouchClassName: `${elementHoverAndTouchClassNames.className} ${touchExceptionClassname.slice(1)}`,
      setElementHoverClassName: () => elementHoverAndTouchClassNames.setHoverClassName(hoverClassname),
      resetElementHoverClassName: () => elementHoverAndTouchClassNames.setHoverClassName(""),
      resetElementTouchClassName: (makeTimeot: boolean) => elementHoverAndTouchClassNames.resetTouchClassName(makeTimeot),
      resetShowElementOnTouchEvent,
      showElement,
      hideElement
   }
}