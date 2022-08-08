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
import AudioElements from 'common/AudioPlayer/AudioElements';
import GeneralPlayerInterface from 'common/GeneralPlayerInterfaces/GeneralPlayerInterface';
import { AudioPlayerContext, useAudioPlayer } from 'common/AudioPlayer/useAudioPlayer';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFound } from 'pages/NotFound/NotFound';



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
   const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);
   const [popup, setPopup] = useState<JSX.Element | undefined>(undefined);
   const appRef = useRef<HTMLDivElement>(null);
   const headerContainerRef = useRef<HTMLDivElement>(null);
   const sidebarsContainerRef = useRef<HTMLDivElement>(null);
   const pagesContainerRef = useRef<HTMLDivElement>(null);




   const {
      audioPlayerContainerRef,
      audioPlayerContext
   } = useAudioPlayer();

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
      audioPlayerContainerElem: audioPlayerContainerRef.current!
   }




   const appStyle = useAppScrollSetting(
      popupControlsContext.needToShowPopup! || needToShowPopup,
      popupControlsContext.needToShowBackground! || needToShowPopup,
      elements,
      showPreloader,
   );




   useEffect(() => {
      dispatch(profileActions.setProfileInfoMode("view"));
      dispatch(getProfileProps());
   }, []);




   return (
      <div className={styles.app} ref={appRef} style={appStyle}>
         <AppContext.Provider value={{ showPreloader, setShowPreloader, setShowAudioPlayer, setPopup }}>
            <PopupContext.Provider value={{ ...popupContext }}>
               <PopupControlsContext.Provider value={{ ...popupControlsContext }}>
                  <ShowPopupContext.Provider value={{ ...showPopupContextValue }}>
                     <AudioPlayerContext.Provider value={{ ...audioPlayerContext }}>

                        <Header appRef={appRef} headerContainerRef={headerContainerRef} />
                        <div className={styles.sidebarsContainer} ref={sidebarsContainerRef}>
                           <LeftPanel />
                           <RightPanel />
                        </div>
                        <div className={`${styles.pagesContainer} ${showAudioPlayer ? styles.withAudioPlayer : ""}`} ref={pagesContainerRef}>
                           <Routes>
                              <Route
                                 path="/"
                                 element={<Navigate to="Profile" replace />}
                              />
                              <Route path='/Profile' element={<Profile />} />
                              <Route path='/:parent/NotFoundPage' element={<NotFound />} />
                              <Route
                                 path="/News"
                                 element={<Navigate to="NotFoundPage" replace />}
                              />
                              <Route
                                 path="/Messages"
                                 element={<Navigate to="NotFoundPage" replace />}
                              />
                              <Route
                                 path="/Friends"
                                 element={<Navigate to="NotFoundPage" replace />}
                              />
                              <Route
                                 path="/Communities"
                                 element={<Navigate to="NotFoundPage" replace />}
                              />
                              <Route
                                 path="/Settings"
                                 element={<Navigate to="NotFoundPage" replace />}
                              />
                           </Routes>
                        </div>
                        <div className={styles.popupControlsContainer} style={popupControlsContext.popupStyle}>
                           <Controls />
                        </div>
                        <div className={styles.appPopup}>
                           {
                              needToShowPopup && popup
                                 ? popup
                                 : null
                           }
                        </div>
                        <AudioElements />
                        <GeneralPlayerInterface styles={styles} containerRef={audioPlayerContainerRef} />
                     </AudioPlayerContext.Provider>
                  </ShowPopupContext.Provider>
               </PopupControlsContext.Provider>
            </PopupContext.Provider>
         </AppContext.Provider>
      </div>
   )
}



export default App