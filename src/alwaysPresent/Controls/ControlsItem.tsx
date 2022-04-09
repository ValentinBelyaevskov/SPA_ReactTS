import styles from './ControlsItem.module.scss';
import React from 'react';


type IconsLoaded = boolean[];

type Props = {
   buttonName: "Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings",
   index: number,
   controlIconsLoaded: IconsLoaded,
   setControlIconsLoaded: React.Dispatch<React.SetStateAction<IconsLoaded>>
}


const ControlsItem = (props: Props) => {
   const setIconLoadingStatus = () => {
      const newLoadedIconsArr = [...props.controlIconsLoaded];
      newLoadedIconsArr[props.index] = true;
      props.setControlIconsLoaded(newLoadedIconsArr);
   }


   return (
      <li className={styles.controlsListItem}>
         <img
            className={styles.buttonIcon}
            onLoad={setIconLoadingStatus}
            src={`./icons/${props.buttonName.toLocaleLowerCase()}.svg`}
            alt={`${props.buttonName} page icon`}
         />
         <span className={`${styles.buttonName} unselectable`}>
            {props.buttonName}
         </span>
      </li>
   )
}

export default ControlsItem