import styles from './Parameter.module.scss';
import { splitStringIntoWords } from '../../../functions/splitStringIntoWords';
import { useRef, useEffect, useState } from 'react';
import getValueWithoutMeasurer from '../../../functions/getValueWithoutMeasurer';
import { shortenTheString } from '../../../functions/shortenTheString';
import { Popup, usePopupElement } from '../../../hooks';


type Props = {
   parameterName: string
   parameterValue: string
   setShowPropmpt: (showPropmpt: boolean) => void
   popup: Popup
}


const Parameter = (props: Props) => {
   // consts
   const [parameterValue, setParameterValue] = useState<string>(props.parameterValue)
   const notVisibleValue: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
   const [isTheStringLong, setIsTheStringLong] = useState<boolean>(false)


   // effects
   useEffect(() => {
      if (notVisibleValue.current) {
         const parameterValueWidth: string = getComputedStyle(notVisibleValue.current).width;
         if (+getValueWithoutMeasurer(parameterValueWidth) > 200) {
            setParameterValue(shortenTheString(parameterValue, 15))
            setIsTheStringLong(true)
         }
         notVisibleValue.current.style.display = "none"
      }
   }, [notVisibleValue])

   useEffect(() => {
      if (props.popup.needToShowElement && isTheStringLong) {
         props.setShowPropmpt(true)
      } else {
         props.setShowPropmpt(false)
      }
   }, [props.popup.needToShowElement, isTheStringLong])


   // functions
   const copyValue = async (): Promise<void> => {
      navigator.clipboard.writeText(props.parameterValue)
   }

   const showPrompt = (): void => {
      props.popup.showElementWithTimeout(500)
   }

   const hidePrompt = (): void => {
      props.popup.hideElementWithTimeout(0)
   }


   return (
      <div className={styles.parameter}>
         <div className={styles.parameterName}>
            {splitStringIntoWords(props.parameterName, true) + " :"}
         </div>
         {
            isTheStringLong
               ? (
                  <div
                     className={`${styles.parameterValue} unselectable ${styles.selectedValue}`}
                     onMouseEnter={showPrompt}
                     onMouseLeave={hidePrompt}
                     onDoubleClick={copyValue}
                  >
                     {parameterValue}
                  </div>
               )
               : (
                  <div className={styles.parameterValue}>
                     {parameterValue}
                  </div>
               )
         }
         {/* {
            popup.needToShowElement && isTheStringLong
               ? (<div ref={prompt} className={styles.prompt}>
                  Double click to copy the parameter value
               </div>)
               : undefined
         } */}
         <div className={styles.notVisibleValue} ref={notVisibleValue}>
            {props.parameterValue}
         </div>
      </div>
   )
}

export default Parameter