import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ControlsItem.module.scss';



type Props = {
   buttonName: "Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings",
   icon: string
}

type IsActiveObj = {isActive: boolean}



const ControlsItem = (props: Props) => {
   const itemHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);

   const [itemClassName] = useState(`${styles.controlsListItem} ${itemHoverAndTouchClassNames.className} unselectable`);




   const getItemClassName = ({isActive}: IsActiveObj): string => isActive ? `${itemClassName} ${styles.activeItem}`: itemClassName;




   return (
      <NavLink
         to={props.buttonName}
         className={getItemClassName}
         onClick={itemHoverAndTouchClassNames.clickListener}
         onMouseEnter={itemHoverAndTouchClassNames.mouseEnterListener}
         onTouchStart={itemHoverAndTouchClassNames.touchStartListener}
         onTouchEnd={itemHoverAndTouchClassNames.touchEndListener}
      >
         <img
            className={styles.buttonIcon}
            src={props.icon}
            alt={`${props.buttonName} page icon`}
         />
         <span className={`${styles.buttonName} unselectable`}>
            {props.buttonName}
         </span>
      </NavLink>
   )
}

export default ControlsItem