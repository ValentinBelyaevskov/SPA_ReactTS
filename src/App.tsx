import styles from './App.module.scss'
import React, { useEffect, useState } from 'react';
import { Header, LeftPanel, RightPanel } from 'alwaysPresent';
import { Profile } from 'pages';
import { getProfileProps, profileActions } from 'pages/Profile/redux/profileReducer';
import { useAppDispatch } from 'hooks/redux';
import { AppCtxt, PopupControlsCtxt, PopupCtxt, ShowPopupCtxt } from 'types/types';
import Controls from 'alwaysPresent/Controls/Controls';
import { usePopupControlsContext } from './hooks/App/usePopupControlsContext';
import { useAppScrollSetting } from 'hooks/App/useAppScrollSetting';
import { useRef } from 'react';



type Props = {
}



export const PopupControlsContext = React.createContext<PopupControlsCtxt>({});
export const PopupContext = React.createContext<PopupCtxt>({});
export const ShowPopupContext = React.createContext<ShowPopupCtxt>({});
export const AppContext = React.createContext<AppCtxt>({});



const App = (props: Props) => {
   const dispatch = useAppDispatch();
   const [showPreloader, setShowPreloader] = useState<boolean>(true);
   const [needToShowPopup, setNeedToShowPopup] = useState<boolean>(false);
   const appRef = useRef<HTMLDivElement>(null);
   const headerContainerRef = useRef<HTMLDivElement>(null);
   const sidebarsContainerRef = useRef<HTMLDivElement>(null);
   const pagesContainerRef = useRef<HTMLDivElement>(null);

   const popupControlsContext = usePopupControlsContext();
   const popupContext = {
      needToShowPopup,
      setNeedToShowPopup
   }
   const showPopupContextValue: ShowPopupCtxt = {
      appRef,
      pagesContainerRef
   };
   const elements = {
      appElem: appRef.current!,
      headerContainerElem: headerContainerRef.current!,
      sidebarsContainerElem: sidebarsContainerRef.current!,
      pagesContainerElem: pagesContainerRef.current!,
   }



   const appStyle = useAppScrollSetting(
      popupControlsContext.needToShowPopup! || needToShowPopup,
      popupControlsContext.needToShowBackground! || needToShowPopup,
      elements,
      showPreloader
   );



   useEffect(() => {
      dispatch(profileActions.setProfileInfoMode("view"));
      dispatch(getProfileProps());
   }, []);



   return (
      <div className={styles.app} ref={appRef} style={appStyle}>
         <AppContext.Provider value={{ showPreloader, setShowPreloader }}>
            <PopupContext.Provider value={{ ...popupContext }}>
               <PopupControlsContext.Provider value={{ ...popupControlsContext }}>
                  <ShowPopupContext.Provider value={{ ...showPopupContextValue }}>
                     <Header appRef={appRef} headerContainerRef={headerContainerRef} />
                     <div className={styles.sidebarsContainer} ref={sidebarsContainerRef}>
                        <LeftPanel />
                        <RightPanel />
                     </div>
                     <div className={styles.pagesContainer} ref={pagesContainerRef}>
                        <Profile />
                        <div className={styles.pageBackground}></div>
                     </div>
                     <div className={styles.popupControlsContainer} style={popupControlsContext.popupStyle}>
                        <Controls />
                     </div>
                  </ShowPopupContext.Provider>
               </PopupControlsContext.Provider>
            </PopupContext.Provider>
         </AppContext.Provider>
      </div>
   )
}


export default App