import styles from './Controls.module.scss'
import { useState, useEffect, useContext, useRef } from 'react';
import { useWindowsSize } from '../../hooks/useWindowsSize';
import ControlsItem from './ControlsItem'
import { useTouchEvents } from '../../hooks/useTouchEvents';
import { usePopupElement } from '../../hooks/usePopupElement';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { ControlsContext } from '../../App';


// types
type Props = {
}

type PagesList = ("Profile" | "News" | "Messages" | "Friends" | "Communities" | "Settings")[];

type ControlsListContainerStyle = { transform?: "translateX(100%)", display?: "none" };


const Controls = (props: Props) => {
   // consts, vars
   const context = useContext(ControlsContext);

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
   const { windowSize, addResizeListener, removeResizeListener } = useWindowsSize(600);
   const controlsBackground: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

   // custom hooks
   const touchMove = useTouchEvents("touchmove", [".headerControlsElement"], hideControlsOnTouchEvent);
   const touchStart = useTouchEvents("touchstart", [".headerControlsElement"], hideControlsOnTouchEvent);
   const popupBackground = usePopupElement(controlsBackground)


   // functions
   function hideControlsOnTouchEvent(): void {
      context.burgerIconClickListener!(context.needToShowControls!)
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
      context.setIcon!('./icons/hide.svg');
      setControlsListContainerStyle({ transform: 'translateX(100%)' });
      addResizeListener();
      addTouchEventListeners();
      popupBackground.showElementWithTimeout(0);
   }

   function hideControls(): void {
      context.setIcon!('./icons/burger.svg');
      setControlsListContainerStyle({});
      removeResizeListener();
      enableTouchEventsSimulation();
      popupBackground.hideElementWithTimeout(0);
   }


   // effects
   useEffect(() => {
      if (windowSize[0] > 600) {
         context.setNeedToShowControls!(false);
         popupBackground.hideElementWithoutAnimation()
      }
   }, [windowSize]);

   useEffect(() => {
      if (context.needToShowControls) {
         showControls();
      } else {
         hideControls();
      }
   }, [context.needToShowControls]);


   return (
      <div className={`${styles.controls}`}>
         {
            popupBackground.needToShowElement ?
               <div className={styles.controlsBackground} ref={controlsBackground}></div>
               : null
         }
         <div className={`${styles.controlsListContainer}  headerControlsElement`} style={controlsListContainerStyle}>
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
            setIconsLoaded={context.setControlsLoaded!}
         />
      </div>
   )
}

export default Controls