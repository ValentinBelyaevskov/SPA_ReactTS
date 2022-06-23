import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import styles from './ControlsItem.module.scss';


type Props = {
   buttonName: "Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings",
   icon: string
}


const ControlsItem = (props: Props) => {
   const itemHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);


   return (
      <li
         className={`${styles.controlsListItem} ${itemHoverAndTouchClassNames.className} unselectable`}
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
      </li>
   )
}

export default ControlsItem