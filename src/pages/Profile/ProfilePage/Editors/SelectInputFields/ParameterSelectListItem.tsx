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
   const listItemHoverAndTouchClassNames = useHoverAndTouchClassNames();
   const [makeTimeout, setMakeTimeout] = useState<boolean>(true);



   useEffect(() => {
      return () => {
         setMakeTimeout(false)
      };
   }, []);



   return (
      <div
         className={`${props.styles.listItem} unselectable ${listItemHoverAndTouchClassNames.className} ${props.fieldName}SelectElement`}
         onClick={props.valuesListItemClickHandler}
         onMouseEnter={() => listItemHoverAndTouchClassNames.setHoverClassName(props.styles.hover)}
         onMouseLeave={() => listItemHoverAndTouchClassNames.setHoverClassName("")}
         onTouchStart={() => listItemHoverAndTouchClassNames.setTouchClassName(props.styles.touch)}
         onTouchEnd={() => listItemHoverAndTouchClassNames.resetTouchClassName(makeTimeout)}
      >
         {props.value}
      </div>
   )
}



export default ParameterSelectListItem