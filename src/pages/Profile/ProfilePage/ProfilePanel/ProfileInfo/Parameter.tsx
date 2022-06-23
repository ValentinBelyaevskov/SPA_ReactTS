import styles from './Parameter.module.scss';
import { splitStringIntoWords } from '../../../../../functions/splitStringIntoWords';
import { useState } from 'react';
import React from 'react';
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import NotVisibleParameterValue from 'common/NotVisibleParameterValue/NotVisibleParameterValue';



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
   const fullInfoPseudoClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);




   const highlightButton = (showFullInfo: boolean): void => {
      if (!showFullInfo) props.setHighlightShowMoreButton(true);
   }

   const doNotHighlightButton = (): void => {
      props.setHighlightShowMoreButton(false);
   }

   const mouseEnterListener = (): void => {
      highlightButton(props.showFullInfo);
      fullInfoPseudoClassNames.mouseEnterListener();
   }

   const mouseLeaveListener = (): void => {
      doNotHighlightButton();
   }

   const touchStartListener = (): void => {
      setNewFullInfoOnTouchTimeout();
      highlightButton(props.showFullInfo);
      fullInfoPseudoClassNames.touchStartListener();
   }

   const touchEndListener = (): void => {
      fullInfoPseudoClassNames.touchEndListener();
   }

   const setNewFullInfoOnTouchTimeout = () => {
      if (props.hideFullInfoOnTouchTimeout) clearTimeout(props.hideFullInfoOnTouchTimeout);

      const timeout = setTimeout(() => {
         doNotHighlightButton();
      }, 1000);

      props.setHideFullInfoOnTouchTimeout(timeout);
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
                     onClick={fullInfoPseudoClassNames.clickListener}
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
            className={styles.notVisibleValue}
            configForAdaptability={[
               [570, undefined, 215, 17],
               [500, 570, 164, 13],
               [461, 500, 125, 10],
               [400, 460, 225, 16],
               [340, 400, 171, 11],
               [300, 340, 145, 9],
               [undefined, 300, 105, 6],
            ]}
         />
      </div>
   )
}

export default Parameter