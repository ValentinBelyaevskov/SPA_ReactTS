import { useState, useEffect } from 'react';
import { useWindowsSize } from '../../hooks/useWindowsSize';
import styles from './Controls.module.scss'
import ControlsItem from './ControlsItem'
import React from 'react';
import { useTouchEvents } from '../../hooks/useTouchEvents';
import BurgerIcons from './BurgerIcons';


// types
type Props = {
   setControlsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

type PagesList = ("Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings")[];

type Icon = "./icons/hide.svg" | "./icons/burger.svg";

type ControlsListContainerStyle = { transform?: "translateX(100%)", display?: "none" };

type IconsLoaded = boolean[];


const Controls = (props: Props) => {
   // consts, vars
   const pagesList: PagesList = [
      "Profile",
      "News",
      "Messages",
      "Friends",
      "Communities",
      "Settings",
   ];
   const [needToShowControls, setNeedToShowControls] = useState<boolean>(false);
   const [icon, setIcon] = useState<Icon>("./icons/burger.svg");
   const [controlIconsLoaded, setControlIconsLoaded] = useState<IconsLoaded>(pagesList.map(() => false));
   const [burgerIconLoaded, setBurgerIconLoaded] = useState<boolean>(false);
   const [hideIconLoaded, setHideIconLoaded] = useState<boolean>(false);
   const [controlsListContainerStyle, setControlsListContainerStyle] = useState<ControlsListContainerStyle>({ display: 'none' });
   const { windowSize, addResizeListener, removeResizeListener } = useWindowsSize(600);

   // custom hooks
   const touchMove = useTouchEvents("touchmove", [".headerControlsElement"], hideControlsOnTouchEvent);
   const touchStart = useTouchEvents("touchstart", [".headerControlsElement"], hideControlsOnTouchEvent);


   // functions
   function hideControlsOnTouchEvent (): void {
      hideControls();
      burgerIconClickListener(needToShowControls);
   }

   const burgerIconClickListener = (needToShowControls: boolean): void => {
      if (needToShowControls) {
         setNeedToShowControls(false);
      } else {
         setNeedToShowControls(true);
      }
   }

   const addTouchEventListeners = (): void => {
      touchMove.removeEventListener();
      touchMove.addEventListener();
      touchStart.removeEventListener();
      touchStart.addEventListener();
   }

   const enableTouchEventsSimulation = (): void => {
      touchMove.enableEventSimulation();
      touchStart.enableEventSimulation();
   }

   const showControls = (): void => {
      setIcon('./icons/hide.svg');
      setControlsListContainerStyle({ transform: 'translateX(100%)' });
      addResizeListener();
   }

   function hideControls(): void {
      setIcon('./icons/burger.svg');
      setControlsListContainerStyle({});
      removeResizeListener();
      props.setControlsLoaded(true);
   }


   // effects
   useEffect(() => {
      if (windowSize[0] > 750) {
         setNeedToShowControls(false);
         enableTouchEventsSimulation()
      }
   }, [windowSize]);

   useEffect(() => {
      if (needToShowControls) {
         showControls();
         addTouchEventListeners();
      } else if (!controlIconsLoaded.includes(false) && burgerIconLoaded && hideIconLoaded) {
         hideControls();
         enableTouchEventsSimulation();
      }
   }, [needToShowControls, controlIconsLoaded, burgerIconLoaded, hideIconLoaded]);


   return (
      <div className={`${styles.controls} headerControlsElement`}>
         <div
            className={`${styles.burgerIcon} unselectable`}
            onClick={() => {burgerIconClickListener(needToShowControls); console.log("clickStart")}}
         >
            <img src={icon} alt="burger menu icon" />
         </div>
         <BurgerIcons
            setBurgerIconLoaded={setBurgerIconLoaded}
            setHideIconLoaded={setHideIconLoaded}
         />
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