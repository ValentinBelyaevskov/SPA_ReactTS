import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import styles from './ControlsItem.module.scss';


type Props = {
   buttonName: "Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings",
   icon: string
}


const ControlsItem = (props: Props) => {
   const itemHoverAndTouchClassNames = useHoverAndTouchClassNames();


   return (
      <li
         className={`${styles.controlsListItem} ${itemHoverAndTouchClassNames.className} unselectable`}
         onMouseEnter={() => itemHoverAndTouchClassNames.setHoverClassName(styles.hover)}
         onMouseLeave={() => itemHoverAndTouchClassNames.setHoverClassName("")}
         onTouchStart={() => itemHoverAndTouchClassNames.setTouchClassName(styles.touch)}
         onTouchEnd={() => itemHoverAndTouchClassNames.resetTouchClassName(true)}
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