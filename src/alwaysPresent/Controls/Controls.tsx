import { useState, useEffect } from 'react';
import { useWindowsSize } from '../../hooks/useWindowsSize';
import styles from './Controls.module.scss'
import ControlsItem from './ControlsItem'


// types
type Props = {
}

type PagesList = ("Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings")[];

type Icon = "./icons/hide.svg" | "./icons/burger.svg";

type ControlsListContainerStyle = { transform?: "translateX(101%)" }


const Controls = (props: Props) => {
   // vars
   const pagesList: PagesList = [
      "Profile",
      "News",
      "Messages",
      "Friends",
      "Communities",
      "Settings",
   ];
   const [showControls, setShowControls] = useState<boolean>(false);
   const [icon, setIcon] = useState<Icon>("./icons/burger.svg");
   const [controlsListContainerStyle, setControlsListContainerStyle] = useState<ControlsListContainerStyle>({});
   const {windowSize, addResizeListener, removeResizeListener} = useWindowsSize(600);


   // functions
   const burgerIconClickListener = (showControls: boolean): void => {
      if (showControls) {
         setShowControls(false);
      } else {
         setShowControls(true);
      }
   }


   // effects
   useEffect(() => {
      if (windowSize[0] > 600) {
         setShowControls(false);
      }
   }, [windowSize]);

   useEffect(() => {
      if (showControls) {
         setIcon('./icons/hide.svg');
         setControlsListContainerStyle({ transform: 'translateX(101%)' });
         addResizeListener();
      } else {
         setIcon('./icons/burger.svg');
         setControlsListContainerStyle({});
         removeResizeListener();
      }
   }, [showControls]);


   console.log("render", windowSize[0]);


   return (
      <div className={styles.controls}>
         <div className={styles.burgerIcon} onClick={() => burgerIconClickListener(showControls)} >
            <img src={icon} alt="burger menu icon" />
         </div>
         <div className={styles.controlsListContainer} style={controlsListContainerStyle}>
            <ul className={styles.controlsList}>
               {pagesList.map((item) => <ControlsItem key={item} buttonName={item} />)}
            </ul>
         </div>
      </div>
   )
}

export default Controls