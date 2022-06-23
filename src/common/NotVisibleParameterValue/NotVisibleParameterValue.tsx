import { useEffect, useRef, useState } from 'react';
import styles from './NotVisibleParameterValue.module.scss';
import { removeExtraSpaces, shortenTheString } from 'functions';
import getValueWithoutMeasure from 'functions/getValueWithoutMeasure';
import { ConfigForAdaptability, useSetParameterSize } from './useSetParameterSize';



type Props = {
   parameterValue: string | number | null | undefined
   setIsTheValueLong: React.Dispatch<React.SetStateAction<boolean | undefined>>
   setVisibleParameterValue: React.Dispatch<React.SetStateAction<string | number | null | undefined>>
   setStringWithLineBreak: React.Dispatch<React.SetStateAction<(JSX.Element | string)[]>>
   configForAdaptability: ConfigForAdaptability
   className: string
   renderBreackPoint?: number
}



const NotVisibleParameterValue = (props: Props) => {
   const notVisibleValue: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const [showNotVisibleValue, setShowNotVisibleValue] = useState<boolean>(false);
   const [valueToTest, setValueToTest] = useState<string | number | null | undefined>(undefined);
   const [isTheStringLong, setIsTheStringLong] = useState<boolean>(false);
   const [isTheWordLong, setIsTheWordLong] = useState<boolean>(false);
   const [wordsArr, setWordsArr] = useState<string[]>([]);
   const [wordsWithLineBreakArr, setWordsWithLineBreakArr] = useState<(string | JSX.Element)[]>([]);
   const [wordNumber, setWordNumber] = useState<number>(0);
   const [stringSizeWasObtained, setStringSizeWasObtained] = useState<boolean>(false);
   const [wordSizeWasObtained, setWordSizeWasObtained] = useState<boolean>(false);
   const { maxParameterWidth, maxParameterLength, moreOrLessThanTheBreakpoint } = useSetParameterSize(props.configForAdaptability, props.renderBreackPoint);




   const getStringWithLineBreak = (parameterValue: string | number, isTheStringLong: boolean, needASpaceAtTheEnd: boolean): JSX.Element | string => {
      return isTheStringLong ?
         <span className={styles.breakWord} key={`${parameterValue}${wordNumber}}`}>{`${parameterValue}${needASpaceAtTheEnd ? " " : ""}`}</span>
         : `${parameterValue}${needASpaceAtTheEnd ? " " : ""}`
   }




   useEffect(() => {
      setWordsArr(removeExtraSpaces(`${props.parameterValue}`).split(" "));
   }, [props.parameterValue])


   useEffect(() => {
      if (
         (moreOrLessThanTheBreakpoint !== undefined && props.renderBreackPoint)
         || !props.renderBreackPoint
      ) {

         setStringSizeWasObtained(false);
         setIsTheStringLong(false);
         setWordSizeWasObtained(false);
         setIsTheWordLong(false);
         setWordsWithLineBreakArr([]);
         setWordNumber(0);
         setValueToTest(undefined);
         setShowNotVisibleValue(false);
      }
   }, [maxParameterWidth, maxParameterLength, moreOrLessThanTheBreakpoint, props.renderBreackPoint])


   useEffect(() => {
      if (!stringSizeWasObtained) {
         setValueToTest(props.parameterValue);
      }
   }, [stringSizeWasObtained, props.parameterValue, maxParameterWidth, maxParameterLength, moreOrLessThanTheBreakpoint])


   useEffect(() => {
      // ? при wordNumber === 0 wordSizeWasObtained === true,
      // когда stringSizeWasObtained === true и valueToTest !== props.parameterValue
      // и в 2-х эффектах ниже setWordSizeWasObtained(true)
      if (wordSizeWasObtained && isTheStringLong && (wordsArr.length > 1) && (wordNumber < wordsArr.length)) {
         setValueToTest(wordsArr[wordNumber]);
         setWordSizeWasObtained(false);
         setWordNumber(wordNumber + 1);
      }
   }, [valueToTest, wordsWithLineBreakArr, wordsArr, wordNumber, props.parameterValue, isTheStringLong, wordSizeWasObtained])


   useEffect(() => {
      if ((!stringSizeWasObtained || !wordSizeWasObtained) && valueToTest) {
         const valueToTestLength: number = valueToTest !== undefined ?
            `${valueToTest}`.length
            : 0

         if (valueToTestLength > maxParameterLength) {
            setShowNotVisibleValue(true);
         } else {
            if (!stringSizeWasObtained) {
               setIsTheStringLong(false);
               setStringSizeWasObtained(true);
            } else if (!wordSizeWasObtained) {
               setIsTheWordLong(false);
               setWordSizeWasObtained(true);
            }
         }
      }
   }, [valueToTest, stringSizeWasObtained, wordSizeWasObtained, maxParameterLength])


   useEffect(() => {
      if (!notVisibleValue.current || !showNotVisibleValue || !valueToTest) return;
      const valueToTestWidth: number = +getValueWithoutMeasure(getComputedStyle(notVisibleValue.current!).width);
      const valueToTestLength: number = valueToTest !== undefined ?
         `${valueToTest}`.length
         : 0

      if (valueToTestLength > 0 && valueToTestWidth === 0) return

      if (valueToTestWidth > maxParameterWidth) {
         if (!stringSizeWasObtained) {
            setIsTheStringLong(true);
            setStringSizeWasObtained(true);
         } else if (!wordSizeWasObtained) {
            setIsTheWordLong(true);
            setWordSizeWasObtained(true);
         }
      } else {
         if (!stringSizeWasObtained) {
            setIsTheStringLong(false);
            setStringSizeWasObtained(true);
         } else if (!wordSizeWasObtained) {
            setIsTheWordLong(false);
            setWordSizeWasObtained(true);
         }
      }

      setShowNotVisibleValue(false)

   }, [stringSizeWasObtained, wordSizeWasObtained, valueToTest, showNotVisibleValue, notVisibleValue.current, maxParameterWidth, moreOrLessThanTheBreakpoint, wordNumber])


   useEffect(() => {
      if (
         (!valueToTest && valueToTest !== 0)
         || (!stringSizeWasObtained)
         || (valueToTest !== props.parameterValue)
         || (!`${props.parameterValue}`.includes(`${valueToTest}`))
      ) return

      const stringWithLineBreak: JSX.Element | string = getStringWithLineBreak(valueToTest, isTheStringLong, true)
      const visibleParameterValue: string = isTheStringLong ?
         shortenTheString(removeExtraSpaces(`${valueToTest}`), maxParameterLength)
         : `${valueToTest}`;

      props.setIsTheValueLong(isTheStringLong);
      props.setStringWithLineBreak([stringWithLineBreak]);
      props.setVisibleParameterValue(visibleParameterValue);

   }, [stringSizeWasObtained, valueToTest, isTheStringLong, maxParameterLength, props.parameterValue])


   useEffect(() => {
      if (
         (!valueToTest && valueToTest !== 0)
         || ((wordNumber !== wordsWithLineBreakArr.length + 1) && wordNumber)
         || (valueToTest === props.parameterValue)
         || (!`${props.parameterValue}`.includes(`${valueToTest}`))
         || !wordSizeWasObtained
      ) return

      const needASpaceAtTheEnd: boolean = wordNumber === wordsArr.length ? false : true
      const wordWithLineBreak: JSX.Element | string = getStringWithLineBreak(valueToTest, isTheWordLong, needASpaceAtTheEnd)

      setWordsWithLineBreakArr([...wordsWithLineBreakArr, wordWithLineBreak])

      if (isTheStringLong) {
         if (wordNumber === wordsArr.length) {

         }
      }

   }, [valueToTest, props.parameterValue, isTheWordLong, wordSizeWasObtained, wordsWithLineBreakArr, wordsArr, wordNumber])


   useEffect(() => {
      if (valueToTest && valueToTest !== props.parameterValue) {
         props.setStringWithLineBreak(wordsWithLineBreakArr);
      }
   }, [valueToTest, props.parameterValue, wordsWithLineBreakArr])




   return (
      <>
         {showNotVisibleValue
            ? (<div className={`${props.className} ${styles.valueToTest}`} ref={notVisibleValue}>
               {valueToTest}
            </div>)
            : null}
      </>
   )
}

export default NotVisibleParameterValue