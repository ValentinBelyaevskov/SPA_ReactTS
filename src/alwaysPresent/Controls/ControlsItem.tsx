import styles from './ControlsItem.module.scss';
import React from 'react';


type IconsLoaded = boolean[];

type Props = {
   buttonName: "Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings",
   icon: string
}


const ControlsItem = (props: Props) => {
   return (
      <li className={styles.controlsListItem}>
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