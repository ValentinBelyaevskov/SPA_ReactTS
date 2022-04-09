import styles from './Parameter.module.scss';
import { splitStringIntoWords } from '../../../../functions/splitStringIntoWords';
import { useRef, useEffect, useState } from 'react';
import getValueWithoutMeasurer from '../../../../functions/getValueWithoutMeasurer';
import { shortenTheString } from '../../../../functions/shortenTheString';
import { Popup, usePopupElement } from '../../../../hooks';
import { useTouchEvents } from '../../../../hooks/useTouchEvents';
import React from 'react';


type Props = {
   parameterName: string
   parameterValue: string | undefined | number | null
}


const Parameter = (props: Props) => {
   // consts
   const [parameterValue, setParameterValue] = useState<string | undefined | number | null>(props.parameterValue);
   const [isTheStringLong, setIsTheStringLong] = useState<boolean>(false);
   const [showNotVisibleValue, setShowNotVisibleValue] = useState<boolean>(true);
   const [showPromptOnTouchStart, setShowPromptOnTouchStart] = useState<boolean>(true);

   const notVisibleValue: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
   const prompt: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

   // custom hooks
   const touchMove = useTouchEvents("touchmove", [".profileParameterPrompt"], hidePrompt);
   const popup: Popup = usePopupElement(prompt);


   // effects
   useEffect(() => {
      if (!notVisibleValue.current && !showNotVisibleValue) return;

      const parameterValueWidth: string = getComputedStyle(notVisibleValue.current!).width;

      if (+getValueWithoutMeasurer(parameterValueWidth) > 250) {
      // if (+getValueWithoutMeasurer(parameterValueWidth) > 150) {
         setParameterValue(shortenTheString(`${props.parameterValue}`, 20));
         setIsTheStringLong(true);
      } else {
         setParameterValue(props.parameterValue);
         setIsTheStringLong(false);
      }

      if (!notVisibleValue.current) return;

      notVisibleValue.current.style.display = "none";
   }, [notVisibleValue, props.parameterValue, showNotVisibleValue])

   useEffect(() => {
      setTimeout(() => {
         setShowNotVisibleValue(false);
      }, 0);
      setTimeout(() => {
         setShowNotVisibleValue(true);
      }, 0);
   }, [props.parameterValue])


   // functions
   const copyValue = async (): Promise<void> => {
      navigator.clipboard.writeText(`${props.parameterValue}`)
   }

   const showPrompt = (): void => {
      popup.showElementWithTimeout(300)
      setShowPromptOnTouchStart(false)
   }

   function hidePrompt(): void {
      popup.hideElementWithTimeout(0)
      touchMove.enableEventSimulation();
      setShowPromptOnTouchStart(true);
   }

   const showPromptOnTouch = (): void => {
      popup.showElementWithTimeout(0);
      setShowPromptOnTouchStart(false);
      touchMove.addEventListener();
   }

   const hidePromptOnTouch = (): void => {
      popup.hideElementWithTimeout(0);
      setShowPromptOnTouchStart(true);
      touchMove.enableEventSimulation();
   }

   const parameterValueTouchListener = (e: React.TouchEvent<HTMLDivElement>): void => {
      if (showPromptOnTouchStart) {
         showPromptOnTouch();
      } else {
         hidePromptOnTouch();
      }
   }


   return (
      <div className={styles.parameter}>
         <div className={styles.parameterName}>
            {splitStringIntoWords(props.parameterName, true) + " :"}
         </div>
         {
            popup.needToShowElement
               ? (<div
                  ref={prompt}
                  className={`${styles.prompt} profileParameterPrompt`}
                  onMouseEnter={showPrompt}
                  onMouseLeave={hidePrompt}
               >
                  {props.parameterValue}
               </div>)
               : undefined
         }
         {
            isTheStringLong
               ? (
                  <div
                     className={`${styles.parameterValue} unselectable ${styles.selectedValue}`}
                     onMouseEnter={showPrompt}
                     onMouseLeave={hidePrompt}
                     onDoubleClick={copyValue}
                     onTouchStart={parameterValueTouchListener}
                  >
                     {`${parameterValue}`}
                  </div>
               )
               : (
                  <div className={styles.parameterValue}>
                     {`${parameterValue}`}
                  </div>
               )
         }
         {
            showNotVisibleValue
               ? (<div className={styles.notVisibleValue} ref={notVisibleValue}>
                  {props.parameterValue}
               </div>)
               : null
         }
      </div>
   )
}

export default Parameter