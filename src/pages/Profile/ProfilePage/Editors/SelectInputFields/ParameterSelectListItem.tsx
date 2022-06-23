import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import { useEffect, useState } from 'react';



type Props = {
   valuesListItemClickHandler: (e: React.MouseEvent) => void
   value: string | number
   fieldName: string
   styles: {
      readonly [key: string]: string
   }
}



const ParameterSelectListItem = (props: Props) => {
   const listItemHoverAndTouchClassNames = useHoverAndTouchClassNames(props.styles.hover, props.styles.touch);
   const [makeTimeout, setMakeTimeout] = useState<boolean>(true);



   const clickListener = (e: React.MouseEvent): void => {
      props.valuesListItemClickHandler(e);
      listItemHoverAndTouchClassNames.clickListener();
   }



   useEffect(() => {
      return () => {
         setMakeTimeout(false)
      };
   }, []);



   return (
      <div
         className={`${props.styles.listItem} unselectable ${listItemHoverAndTouchClassNames.className} ${props.fieldName}SelectElement`}
         onClick={clickListener}
         onMouseEnter={listItemHoverAndTouchClassNames.mouseEnterListener}
         onTouchStart={listItemHoverAndTouchClassNames.touchStartListener}
         onTouchEnd={listItemHoverAndTouchClassNames.touchEndListener}
      >
         {props.value}
      </div>
   )
}



export default ParameterSelectListItem