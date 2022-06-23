import styles from './Controls.module.scss'
import { useState, useEffect, useContext, useRef } from 'react';
import ControlsItem from './ControlsItem';
import { useElementEventHandlers } from 'hooks/useElementEventHandlers';
import { usePopupElement } from 'hooks/usePopup/usePopupElement';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { PopupControlsContext } from 'App';
import { useWindowSize } from 'hooks/useWindowSize';



type Props = {
}

type PagesList = ("Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings")[];

type ControlsListContainerStyle = { transform?: "translateX(100%)", display?: "none" };



const Controls = (props: Props) => {
   const popupContext = useContext(PopupControlsContext);
   const resize = useWindowSize("resize");
   const pagesList: PagesList = [
      "Profile",
      "News",
      "Messages",
      "Friends",
      "Communities",
      "Settings",
   ];
   const icons = pagesList.map(pageName => `./icons/${pageName.toLocaleLowerCase()}.svg`);
   const [controlsListContainerStyle, setControlsListContainerStyle] = useState<ControlsListContainerStyle>({ display: 'none' });
   const controlsBackground: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const controls: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const touchEvents = useElementEventHandlers(["touchmove", 'click', "touchstart"], hideControlsOnTouchEvent, [".headerControlsElement"]);
   const popupBackground = usePopupElement(controlsBackground);



   function hideControlsOnTouchEvent(): void {
      popupContext.popupSwitcherlickListener!(popupContext.needToShowPopup!);
   }


   const showControls = (): void => {
      console.log("showControls")
      popupContext.setIcon!('./icons/hide.svg');
      setControlsListContainerStyle({ transform: 'translateX(100%)' });
      touchEvents.addEventListener();
      popupBackground.showElementWithTimeout(0);
   }

   function hideControls(): void {
      popupContext.setIcon!('./icons/burger.svg');
      setControlsListContainerStyle({});
      touchEvents.enableEventSimulation();
      popupBackground.hideElementWithTimeout(0);
   }



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
                  />
               ))}
            </ul>
         </div>
         <IconsThatAreLoaded
            icons={icons}
            setIconsLoaded={popupContext.setPopupLoaded!}
         />
      </div>
   )
}



export default Controls