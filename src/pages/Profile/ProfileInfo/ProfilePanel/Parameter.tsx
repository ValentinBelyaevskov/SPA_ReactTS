import styles from './Parameter.module.scss';
import { splitStringIntoWords } from '../../../../functions/splitStringIntoWords';
import { useRef, useEffect, useState } from 'react';
import getValueWithoutMeasurer from '../../../../functions/getValueWithoutMeasurer';
import { shortenTheString } from '../../../../functions/shortenTheString';
import { Popup, usePopupElement } from '../../../../hooks';


type Props = {
   parameterName: string
   parameterValue: string | undefined | number | null
}


/* SELECT *
FROM `cityutf8_1`
LEFT JOIN `cityutf8`
ON `cityutf8_1`.`id` = `cityutf8`.`id` */

const Parameter = (props: Props) => {
   // consts
   const [parameterValue, setParameterValue] = useState<string | undefined | number | null>(props.parameterValue)
   const [isTheStringLong, setIsTheStringLong] = useState<boolean>(false)
   const [showNotVisibleValue, setShowNotVisibleValue] = useState<boolean>(true)

   const notVisibleValue: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
   const prompt: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

   // popup
   const popup: Popup = usePopupElement(prompt)


   // effects
   useEffect(() => {
      if (!notVisibleValue.current && !showNotVisibleValue) return

      const parameterValueWidth: string = getComputedStyle(notVisibleValue.current!).width;

      if (+getValueWithoutMeasurer(parameterValueWidth) > 200) {
         setParameterValue(shortenTheString(`${props.parameterValue}`, 15))
         setIsTheStringLong(true)
      } else {
         setParameterValue(props.parameterValue)
         setIsTheStringLong(false)
      }
      if (!notVisibleValue.current) return
      notVisibleValue.current.style.display = "none"
   }, [notVisibleValue, props.parameterValue, showNotVisibleValue])


   useEffect(() => {
      setTimeout(() => {
         setShowNotVisibleValue(false)
      }, 0);
      setTimeout(() => {
         setShowNotVisibleValue(true)
      }, 0);
   }, [props.parameterValue])


   // functions
   const copyValue = async (): Promise<void> => {
      navigator.clipboard.writeText(`${props.parameterValue}`)
   }

   const showPrompt = (): void => {
      popup.showElementWithTimeout(200)
   }

   const hidePrompt = (): void => {
      popup.hideElementWithTimeout(0)
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
                  className={styles.prompt}
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