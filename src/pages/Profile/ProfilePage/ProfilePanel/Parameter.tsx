import styles from './Parameter.module.scss';
import { splitStringIntoWords } from '../../../../functions/splitStringIntoWords';
import { useState, useEffect } from 'react';
import React from 'react';
import NotVisibleParameterValue from './NotVisibleParameterValue';
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';



type Props = {
   parameterName: string | undefined | number | null
   parameterValue: string | undefined | number | null
   showFullInfo: boolean
   setHighlightShowMoreButton: React.Dispatch<React.SetStateAction<boolean>>
   hideFullInfoOnTouchTimeout: NodeJS.Timeout | null
   setHideFullInfoOnTouchTimeout: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>
}



const Parameter = (props: Props) => {
   const [visibleParameterValue, setVisibleParameterValue] = useState<string | undefined | number | null>(props.parameterValue);
   const [stringWithLineBreak, setStringWithLineBreak] = useState<(JSX.Element | string)[]>([]);
   const [isTheValueLong, setIsTheValueLong] = useState<boolean | undefined>(undefined);
   const fullInfoPseudoClassNames = useHoverAndTouchClassNames();



   const highlightButton = (showFullInfo: boolean): void => {
      if (!showFullInfo) props.setHighlightShowMoreButton(true);
   }

   const doNotHighlightButton = (): void => {
      props.setHighlightShowMoreButton(false);
   }

   const mouseEnterListener = (): void => {
      highlightButton(props.showFullInfo);
      fullInfoPseudoClassNames.setHoverClassName(styles.hover);
   }

   const mouseLeaveListener = (): void => {
      doNotHighlightButton();
      fullInfoPseudoClassNames.setHoverClassName("");
   }

   const setNewFullInfoOnTouchTimeout = () => {
      if (props.hideFullInfoOnTouchTimeout) clearTimeout(props.hideFullInfoOnTouchTimeout);

      const timeout = setTimeout(() => {
         doNotHighlightButton();
      }, 1000);

      props.setHideFullInfoOnTouchTimeout(timeout);
   }

   const touchStartListener = (): void => {
      setNewFullInfoOnTouchTimeout();
      highlightButton(props.showFullInfo);
      fullInfoPseudoClassNames.setTouchClassName(styles.touch);
   }

   const touchEndListener = (): void => {
      fullInfoPseudoClassNames.resetTouchClassName(true);
   }



   return (
      <div className={styles.parameter}>
         <div className={styles.parameterName}>
            {splitStringIntoWords(`${props.parameterName}`, true) + " :"}
         </div>
         {
            isTheValueLong
               ?
               (
                  <div
                     className={`${styles.parameterValue} ${props.showFullInfo ? "" : `${styles.selectedValue} ${fullInfoPseudoClassNames.className} unselectable`}`}
                     onMouseEnter={mouseEnterListener}
                     onMouseLeave={mouseLeaveListener}
                     onTouchStart={touchStartListener}
                     onTouchEnd={touchEndListener}
                  >
                     {props.showFullInfo ? stringWithLineBreak : visibleParameterValue}
                  </div>
               )
               : (
                  <div className={styles.parameterValue}>
                     {visibleParameterValue}
                  </div>
               )
         }
         <NotVisibleParameterValue
            parameterValue={props.parameterValue}
            setIsTheValueLong={setIsTheValueLong}
            setStringWithLineBreak={setStringWithLineBreak}
            setVisibleParameterValue={setVisibleParameterValue}
         />
      </div>
   )
}

export default Parameter