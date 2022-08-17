import styles from './App.module.scss'
import React, { useEffect, useState } from 'react';
import { Header, LeftPanel, RightPanel } from 'alwaysPresent';
import { Profile } from 'pages';
import { getLoadInfo, getProfileInfoMode, getProfileProps, profileActions } from 'pages/Profile/redux/profileReducer';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
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
import { useAppContext } from 'hooks/App/useAppContext';




type Props = {
}




export const PopupControlsContext = React.createContext<PopupControlsCtxt>({});
export const PopupContext = React.createContext<PopupCtxt>({});
export const ShowPopupContext = React.createContext<ShowPopupCtxt>({});
export const AppContext = React.createContext<AppCtxt>({});




const App = (props: Props) => {
   const dispatch = useAppDispatch();
   const [popupName, setPopupName] = useState<string | undefined>(undefined);
   const [popup, setPopup] = useState<JSX.Element | undefined>(undefined);
   const appRef = useRef<HTMLDivElement>(null);
   const headerContainerRef = useRef<HTMLDivElement>(null);
   const sidebarsContainerRef = useRef<HTMLDivElement>(null);
   const pagesContainerRef = useRef<HTMLDivElement>(null);




   const {
      profileInfoLoading,
      profileWallLoading,
      profileContentLoading,
      showAudioPlayer,
      setShowAudioPlayer,
      setProfileInfoLoading,
      setProfileWallLoading,
      setProfileContentLoading,

   } = useAppContext();


   const {
      audioPlayerContainerRef,
      audioPlayerContext

   } = useAudioPlayer();


   const popupControlsContext = usePopupControlsContext();


   const popupContext: PopupCtxt = {
      popupName,
      setPopupName,
      setPopup,
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
      popupControlsContext.needToShowPopup! || Boolean(popupName),
      popupControlsContext.needToShowBackground! || Boolean(popupName),
      elements,
      profileContentLoading!,
   );




   useEffect(() => {
      dispatch(profileActions.setProfileInfoMode("pageView"));
      dispatch(getProfileProps());

      // * Real-time event handlers. Call real-time event listeners (thunk / dispatch actions)
   }, []);


   useEffect(() => {
      if (profileInfoLoading || profileWallLoading) {
         setProfileContentLoading(true);
      } else {
         setProfileContentLoading(false);
      }
   }, [profileInfoLoading, profileWallLoading])




   return (
      <div className={styles.app} ref={appRef} style={appStyle}>
         <AppContext.Provider value={
            {
               profileContentLoading,
               setProfileInfoLoading,
               setProfileWallLoading,
               setProfileContentLoading,
               setShowAudioPlayer
            }
         }>
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
                              popupName && popup
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