import { useState, useEffect } from 'react';
import { useWindowsSize } from '../../hooks/useWindowsSize';
import styles from './Controls.module.scss'
import ControlsItem from './ControlsItem'
import React from 'react';


// types
type Props = {
   setControlsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

type PagesList = ("Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings")[];

type Icon = "./icons/hide.svg" | "./icons/burger.svg";

type ControlsListContainerStyle = { transform?: "translateX(100%)", display?: "none" }

type IconsLoaded = boolean[]


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
   const [controlIconsLoaded, setControlIconsLoaded] = useState<IconsLoaded>(pagesList.map(() => false));
   const [burgerIconLoaded, setBurgerIconLoaded] = useState<boolean>(false);
   const [hideIconLoaded, setHideIconLoaded] = useState<boolean>(false);
   const [controlsListContainerStyle, setControlsListContainerStyle] = useState<ControlsListContainerStyle>({ display: 'none' });
   const { windowSize, addResizeListener, removeResizeListener } = useWindowsSize(600);


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
      if (windowSize[0] > 750) {
         setShowControls(false);
      }
   }, [windowSize]);

   useEffect(() => {
      if (showControls) {
         setIcon('./icons/hide.svg');
         setControlsListContainerStyle({ transform: 'translateX(100%)' });
         addResizeListener();
      } else if (!controlIconsLoaded.includes(false) && burgerIconLoaded && hideIconLoaded) {
         setIcon('./icons/burger.svg');
         setControlsListContainerStyle({});
         removeResizeListener();
         props.setControlsLoaded(true);
      }
   }, [showControls, controlIconsLoaded, burgerIconLoaded, hideIconLoaded]);


   return (
      <div className={styles.controls}>
         <div className={`${styles.burgerIcon} unselectable`} onClick={() => burgerIconClickListener(showControls)} >
            <img src={icon} alt="burger menu icon" />
         </div>
         <div className={styles.iconLoadingContainer}>
            <img
               src="./icons/hide.svg"
               alt="burger menu icon"
               onLoad={() => {setBurgerIconLoaded(true)}}
            />
            <img
               src="./icons/burger.svg"
               alt="burger menu icon"
               onLoad={() => {setHideIconLoaded(true)}}
            />
         </div>
         <div className={styles.controlsListContainer} style={controlsListContainerStyle}>
            <ul className={styles.controlsList}>
               {pagesList.map((item, index) => (
                  <ControlsItem
                     key={item}
                     index={index}
                     controlIconsLoaded={controlIconsLoaded}
                     setControlIconsLoaded={setControlIconsLoaded}
                     buttonName={item}
                  />
               ))}
            </ul>
         </div>
      </div>
   )
}

export default Controls