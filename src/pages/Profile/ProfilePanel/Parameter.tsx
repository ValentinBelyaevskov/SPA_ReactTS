import styles from './Parameter.module.scss';
import { splitStringIntoWords } from '../../../functions/splitStringIntoWords';
import { useRef, useEffect, useState } from 'react';
import getValueWithoutMeasurer from '../../../functions/getValueWithoutMeasurer';
import { shortenTheString } from '../../../functions/shortenTheString';


type Props = {
   parameterName: string
   parameterValue: string
}


const Parameter = (props: Props) => {
   // consts
   const notVisibleValue: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
   const prompt: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
   const [parameterValue, setParameterValue] = useState<string>(props.parameterValue)
   const [isTheStringLong, setIsTheStringLong] = useState<boolean>(false)
   const [needToShowPrompt, setNeedToShowPrompt] = useState<boolean>(false)


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
      if (needToShowPrompt) {
         setTimeout(() => {
            prompt.current!.style.opacity = "1"
         }, 0)
      }
   }, [needToShowPrompt])


   // functions
   const copyValue = async () => {
      navigator.clipboard.writeText(props.parameterValue)
   }

   const showPrompt = () => {
      setNeedToShowPrompt(true)
   }

   const hidePrompt = () => {
      setNeedToShowPrompt(false)
   }


   return (
      <div className={styles.parameter}>
         <div className={styles.parameterName}>
            {splitStringIntoWords(props.parameterName, true) + ":"}
         </div>
         {
            isTheStringLong
               ? (<div
                  className={`${styles.parameterValue} unselectable ${styles.selectedValue}`}
                  onMouseOver={showPrompt}
                  onMouseOut={hidePrompt}
                  onDoubleClick={copyValue}
               >
                  {parameterValue}
               </div>)
               : (<div className={styles.parameterValue}>
                  {parameterValue}
               </div>)
         }
         {
            needToShowPrompt && isTheStringLong
               ? (<div ref={prompt} className={styles.prompt}>
                  double click to copy the parameter value
               </div>)
               : undefined
         }
         <div className={styles.notVisibleValue} ref={notVisibleValue}>
            {props.parameterValue}
         </div>
      </div>
   )
}

export default Parameter