import styles from './Profile.module.scss'
import ProfileInfo from './ProfileInfo/ProfileInfo';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getErrorTypes, getLoadInfo, getLoadingStatus, getProfileInfoMode, getProfileMode, profileActions } from './redux/profileReducer';
import { Preloader } from '../../common';
import ErrorPage from './ErrorPage/ErrorPage';
import GuestPage from './GuestPage/GuestPage';
import SignIn from './SignIn/SignIn';


type ProfilePageStyle = {
   zIndex: "",
   marginTop: "",
} | {}


const Profile = () => {
   const [trySignIn, setTrySignIn] = useState<boolean>(false);
   const [profilePageStyle, setProfilePageStyle] = useState<ProfilePageStyle>({});
   const loading = useAppSelector(getLoadingStatus);
   const profileInfoMode: string = useAppSelector(getProfileInfoMode);
   const loadInfo = useAppSelector(getLoadInfo);
   const errorTypes = useAppSelector(getErrorTypes)
   const profileMode: string = useAppSelector(getProfileMode);
   const dispatch = useAppDispatch()


   useEffect(() => {
      return () => {
         dispatch(profileActions.setSignInMode("login"));
         dispatch(profileActions.setProfileInfoMode("view"));
      }
   }, [])

   useEffect(() => {
      if (profileInfoMode === "edit") {
         setProfilePageStyle({
            zIndex: 2,
            marginTop: "3px",
         })
      } else {
         setProfilePageStyle({})
      }
   }, [profileInfoMode]);


   return (
      <div className={`${styles.profile} page`} style={profilePageStyle}>
         {
            loading
               && !trySignIn
               && (profileInfoMode !== "edit")
               ? (
                  <div className={`${styles.loading} pagePart`} >
                     <Preloader containerStyle={{ margin: "0 auto 0 auto" }} />
                  </div>
               )
               : loadInfo.error
                  && (!errorTypes.includes(loadInfo.errorType as string))
                  && !trySignIn
                  ? <ErrorPage setTrySignIn={setTrySignIn} />
                  : (
                     (profileMode === "loggedIn"
                        || profileMode === "loggedOut")
                        ? <ProfileInfo />
                        : (profileMode === "loggedInAsGuest"
                           || profileMode === "guestSignIn")
                           ? <GuestPage />
                           : profileMode === "signIn"
                              ? <SignIn />
                              : null
                  )
         }
      </div>
   )
}

export default Profile