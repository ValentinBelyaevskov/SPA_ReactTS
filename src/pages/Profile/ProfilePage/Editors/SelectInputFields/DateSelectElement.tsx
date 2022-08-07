import { useElementEventHandlers } from 'hooks/useElementEventHandlers';
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import { useState, useEffect, useCallback } from 'react';
import styles from './DateSelectInputFields.module.scss'
import ParameterSelectListItem from './ParameterSelectListItem';



type DateNames = "Day" | "Mounth" | "Year"

type Props = {
   valuesArr: string[] | number[]
   fieldName: DateNames
   defaultValue: string
   setDateValue: React.Dispatch<React.SetStateAction<string>>
}

type ArrowIcon = "./icons/arrowUp.svg" | "./icons/arrowDown.svg"



const icons: ArrowIcon[] = [
   "./icons/arrowUp.svg",
   "./icons/arrowDown.svg",
]



const DateSelectElement = (props: Props) => {
   const [showAListOfDates, setShowAListOfDates] = useState<boolean>(false);
   const [arrowIcon, setArrowIcon] = useState<ArrowIcon>(icons[1]);
   const [dateValue, setDateValue] = useState<number | string>(props.defaultValue);
   const touchAndClickEvents = useElementEventHandlers(['touchstart', 'touchmove', 'click'], selectClickListener, [`.${props.fieldName}SelectElement`]);
   const selectHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);

   function selectClickListener(): void {
      selectHoverAndTouchClassNames.clickListener();
      setShowAListOfDates(!showAListOfDates);
   }

   const datesListItemClickHandler = useCallback((e: React.MouseEvent): void => {
      if (e.target instanceof Element && e.target.textContent) {
         props.setDateValue(e.target.textContent);
         setDateValue(e.target.textContent);
         selectClickListener();
      }
   }, [showAListOfDates]);



   useEffect(() => {
      if (showAListOfDates) {
         setArrowIcon(icons[0]);
         touchAndClickEvents.addEventListener();
      } else {
         setArrowIcon(icons[1]);
         touchAndClickEvents.enableEventSimulation();
      }
   }, [arrowIcon, showAListOfDates]);



   return (
      <div className={`${styles.selectContainer} ${styles[props.fieldName.toLowerCase()]}`}>
         <div
            className={`${styles.select} ${selectHoverAndTouchClassNames.className} unselectable ${props.fieldName}SelectElement`}
            onClick={selectClickListener}
            onMouseEnter={selectHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={selectHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={selectHoverAndTouchClassNames.touchEndListener}
            onTouchMove={() => setShowAListOfDates(true)}
         >
            {dateValue ? dateValue : props.fieldName.toLowerCase()}
            <img className={styles.listArrow} src={arrowIcon} />
         </div>
         {
            showAListOfDates ?
               <div className={`${styles.datesList} ${props.fieldName}SelectElement`}>
                  {props.valuesArr.map(value => (
                     <ParameterSelectListItem
                        key={value}
                        value={value}
                        fieldName={props.fieldName}
                        valuesListItemClickHandler={datesListItemClickHandler}
                        styles={styles}
                     />
                  ))}
               </div>
               : null
         }
      </div>
   )
}



export default DateSelectElement