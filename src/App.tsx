import styles from './App.module.scss'
import React, { useEffect } from 'react';
import { Header, LeftPanel, RightPanel } from 'alwaysPresent';
import { Profile } from 'pages';
import { getProfileProps, profileActions } from 'pages/Profile/redux/profileReducer';
import { useAppDispatch } from 'hooks/redux';
import { ControlsCtxt, ShowPopupContext } from 'types/types';
import Controls from 'alwaysPresent/Controls/Controls';
import { useControlsContext } from './hooks/App/useControlsContext';
import { useShowPopupContext } from 'hooks/App/useShowPopupContext';
import { useRef, useState, useCallback } from 'react';
import getValueWithoutMeasurer from './functions/getValueWithoutMeasurer';
import { useWindowsSize } from './hooks/useWindowsSize';


type Props = {
}


// context
export const ControlsContext = React.createContext<ControlsCtxt>({});
export const showPopupContext = React.createContext<ShowPopupContext>({});


const App = (props: Props) => {
   // ! Задать правильный AppStyle (Что бы скролл сверху сохранялся при показе popup-элемента)
   // ! Показывать preloader только когда он загружен
   // consts
   const dispatch = useAppDispatch();
   const appRef = useRef<HTMLDivElement>(null);
   const pagesRef = useRef<HTMLDivElement>(null);
   const headerRef = useRef<HTMLDivElement>(null);

   // context
   const controlsContext = useControlsContext();
   const { appStyle } = useShowPopupContext(controlsContext.needToShowControls, appRef, pagesRef);
   const showPopupContextValue: ShowPopupContext = {
      appRef,
      pagesRef
   };

   // effects
   useEffect(() => {
      dispatch(profileActions.setProfileInfoMode("view"));
      dispatch(getProfileProps());
   }, []);


   //       *
   // constants
   const [scrollTop, setScrollTop] = useState<number>(0);
   const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
   const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
   // * правильно реагировать на resize для sidebar
   const { windowSize, addResizeListener, removeResizeListener } = useWindowsSize()

   // functions
   const scrollListener = useCallback((): void => {
      setScrollTop(document.documentElement.scrollTop)
   }, [])

   const getElementWindowCoords = (element: HTMLDivElement) => element.getBoundingClientRect()

   const getElementStyle = (element: HTMLDivElement) => getComputedStyle(element)


   // effects
   useEffect(() => {
      if (scrollTop > prevScrollTop) {
         setScrollDirection("down");
      } else if (scrollTop < prevScrollTop) {
         setScrollDirection("up");
      }

      if (!controlsContext.needToShowControls) setPrevScrollTop(scrollTop);
   }, [scrollTop, prevScrollTop])

   // * разрешать скролл только при полном скрытии ControlsBackground (вернуть в Controls в )
   useEffect(() => {
      const header = headerRef.current!;
      const headerHeight = +getValueWithoutMeasurer(getElementStyle(header).height);

      if (scrollDirection === "down" && (scrollTop > headerHeight + 5) && scrollTop !== prevScrollTop) {
         header.style.transform = `translateY(-${headerHeight + 5}px)`;
      } else if (scrollDirection === "up") {
         header.style.transform = `translateY(${0}px)`;
      }
   }, [scrollTop, prevScrollTop, scrollDirection, headerRef])


   // * sidebar useEffect
   // useEffect(() => {
   //    const header = headerRef.current!;
   //    const headerY = getElementWindowCoords(header).y;
   //    const headerHeight = +getValueWithoutMeasurer(getElementStyle(header).height);

   //    if (scrollDirection === "down" && !controlsContext.needToShowControls) {
   //       if (!headerY) {
   //          header.style.position = "absolute";
   //          header.style.top = `${scrollTop}px`;
   //       } else if (Math.abs(headerY) > (headerHeight + 5)) {
   //          header.style.position = "fixed";
   //          header.style.top = `-${headerHeight + 5}px`;
   //       }
   //    } else if (scrollDirection === "up"  && !controlsContext.needToShowControls) {
   //       if (headerY && (Math.abs(headerY) === headerHeight + 5)) {
   //          console.log("up");
   //          header.style.position = "absolute";
   //          header.style.top = `${document.documentElement.scrollTop - headerHeight}px`;
   //       } else if (headerY > 0) {
   //          header.style.position = "fixed";
   //          header.style.top = "0px";
   //       }
   //    }
   // }, [scrollTop, scrollDirection, headerRef, controlsContext.needToShowControls])

   useEffect(() => {
      if (appRef.current && headerRef.current) {
         window.addEventListener("scroll", scrollListener)
      }

      return () => {
         window.removeEventListener("scroll", scrollListener)
      }
   }, [appRef, headerRef, scrollTop, prevScrollTop])
   //       *



   return (
      <div className={styles.app} ref={appRef} style={appStyle}>
         {/* <div className={styles.app}> */}
         <ControlsContext.Provider value={{ ...controlsContext.controlsContextValue }}>
            <showPopupContext.Provider value={showPopupContextValue}>
               <div className={styles.headerContainer} ref={headerRef}>
                  <Header />
               </div>
               <div className={styles.sidebarsContainer}>
                  <LeftPanel />
                  <RightPanel />
               </div>
               <div className={styles.pagesContainer} ref={pagesRef}>
                  <Profile />
                  <div className={styles.pageBackground}></div>
               </div>
               <div className={styles.popupControlsContainer} style={controlsContext.controlsStyle}>
                  <Controls />
               </div>
            </showPopupContext.Provider>
         </ControlsContext.Provider>
      </div>
   )
}

export default App