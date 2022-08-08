import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import { useEffect, useState } from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import styles from './ControlsItem.module.scss';



type Props = {
   buttonName: "Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings",
   icon: string
   activeIcon: string
}

type IsActiveObj = { isActive: boolean }



const ControlsItem = (props: Props) => {
   const itemHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const [path] = useState<string>(
      props.buttonName === 'Profile'
         ? props.buttonName
         : `${props.buttonName}/NotFoundPage`
   );
   const match = useMatch(path);

   const [itemClassName, setItemClassName] = useState(`${styles.controlsListItem} ${itemHoverAndTouchClassNames.className} unselectable`);




   const getItemClassName = ({ isActive }: IsActiveObj): string => isActive ? `${itemClassName} ${styles.activeItem}` : itemClassName;




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
            src={match ? props.activeIcon : props.icon}
            alt={`${props.buttonName} page icon`}
         />
         <span className={`${styles.buttonName} unselectable`}>
            {props.buttonName}
         </span>
      </NavLink>
   )
}

export default ControlsItem