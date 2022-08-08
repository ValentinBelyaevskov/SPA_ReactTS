import styles from './Controls.module.scss'
import { useState, useEffect, useContext, useRef } from 'react';
import ControlsItem from './ControlsItem';
import { useElementEventHandlers } from 'hooks/useElementEventHandlers';
import { usePopupElement } from 'hooks/usePopup/usePopupElement';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { PopupControlsContext } from 'App';
import { useScrollOrWindowSize } from 'hooks/useScrollOrWindowSize';




type Props = {
}

type PagesList = ("Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings")[];

type ControlsListContainerStyle = { transform?: "translateX(100%)", display?: "none" };




const Controls = (props: Props) => {
   const popupContext = useContext(PopupControlsContext);
   const resize = useScrollOrWindowSize("resize");
   const pagesList: PagesList = [
      "Profile",
      "News",
      "Messages",
      "Friends",
      "Communities",
      "Settings",
   ];
   const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);
   const [activeIconsLoaded, setActiveIconsLoaded] = useState<boolean>(false);
   const icons = pagesList.map(pageName => `./icons/${pageName.toLocaleLowerCase()}.svg`);
   const activeIcons = pagesList.map(pageName => `./icons/${pageName.toLocaleLowerCase()}Active.svg`);
   const [controlsListContainerStyle, setControlsListContainerStyle] = useState<ControlsListContainerStyle>({ display: 'none' });
   const controlsBackground: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const controls: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const touchEvents = useElementEventHandlers(["touchmove", 'click', "touchstart"], hideControlsOnTouchEvent, [".headerControlsElement"]);
   const popupBackground = usePopupElement(controlsBackground);



   function hideControlsOnTouchEvent(): void {
      popupContext.setNeedToShowPopup!(false);
   }



   // !
   const showControls = (): void => {
      popupContext.setIcon!('./icons/hide.svg');
      setControlsListContainerStyle({ transform: 'translateX(100%)' });
      touchEvents.addEventListener();
      popupBackground.showElementWithAnimation(0);
   }

   function hideControls(): void {
      popupContext.setIcon!('./icons/burger.svg');
      setControlsListContainerStyle({});
      touchEvents.enableEventSimulation();
      popupBackground.hideElementWithAnimation(0);
   }
   // !




   useEffect(() => {
      if (iconsLoaded && activeIconsLoaded) {
         popupContext.setPopupLoaded!(true)
      }
   }, [iconsLoaded, activeIconsLoaded])

   useEffect(() => {
      popupContext.setNeedToShowBackground!(popupBackground.needToShowElement);
   }, [popupBackground.needToShowElement])

   // * перенести логику в header что бы при размере для мобильного не было лишних рендеров во время скролла
   useEffect(() => {
      if ((resize.value[0] > 600)) {
         popupContext.setNeedToShowPopup!(false);
         popupBackground.hideElementWithoutAnimation();
      }
   }, [resize.value[0]])

   useEffect(() => {
      if (popupContext.needToShowPopup) {
         resize.addEventListener();
         showControls();
         if (controls.current) controls.current.scrollTop = 0;
      } else {
         resize.removeEventListener();
         hideControls();
      }
   }, [popupContext.needToShowPopup])



   return (
      <div className={`${styles.controls}`}>
         {
            popupBackground.needToShowElement ?
               <div className={styles.controlsBackground} ref={controlsBackground}></div>
               : null
         }
         <div className={`${styles.controlsListContainer} headerControlsElement`} style={controlsListContainerStyle} ref={controls}>
            <ul className={styles.controlsList}>
               {pagesList.map((item, i) => (
                  <ControlsItem
                     key={item}
                     buttonName={item}
                     icon={icons[i]}
                     activeIcon={activeIcons[i]}
                  />
               ))}
            </ul>
         </div>
         <IconsThatAreLoaded
            icons={icons}
            setIconsLoaded={setIconsLoaded}
         />
         <IconsThatAreLoaded
            icons={activeIcons}
            setIconsLoaded={setActiveIconsLoaded}
         />
      </div>
   )
}




export default Controls