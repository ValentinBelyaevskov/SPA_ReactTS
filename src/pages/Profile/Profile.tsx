import styles from './Profile.module.scss';
import ProfilePage from './ProfilePage/ProfilePage';
import { useState, useEffect, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getErrorTypes, getLoadInfo, getLoadingStatus, getPostsLoadInfo, getProfileInfoMode, getProfileMode, getProfilePageScroll, profileActions } from './redux/profileReducer';
import { Preloader } from '../../common';
import ErrorPage from './ErrorPage/ErrorPage';
import GuestPage from './GuestPage/GuestPage';
import SignIn from './SignIn/SignIn';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { AppContext } from 'App';




const Profile = () => {
   const icons = [
      "./icons/other.svg",
      "./icons/editBlack.svg",
      "./icons/changePasswordBlack.svg",
      "./icons/signOutBlack.svg",
      "./icons/showPasswordIcon.svg",
      "./icons/hidePasswordIcon.svg",
      "./image/checked.svg",
      "./icons/image.svg",
      "./icons/files.svg",
      "./icons/music.svg",
      "./icons/video.svg",
   ];

   const dispatch = useAppDispatch();
   const [trySignIn, setTrySignIn] = useState<boolean>(false);
   const loading = useAppSelector(getLoadingStatus);
   const profileInfoMode: string = useAppSelector(getProfileInfoMode);
   const loadInfo = useAppSelector(getLoadInfo);
   const errorTypes = useAppSelector(getErrorTypes);
   const profileMode: string = useAppSelector(getProfileMode);
   const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);
   const profileContentLoading = useContext(AppContext).profileContentLoading!;
   const postsLoadInfo = useAppSelector(getPostsLoadInfo);




   useEffect(() => {
      return () => {
         dispatch(profileActions.setSignInMode("login"));
         dispatch(profileActions.setProfileInfoMode("pageView"));
      }
   }, []);


   useEffect(() => {
      console.log("iconsLoaded: ", iconsLoaded, "loading: ", loading, "profileContentLoading: ", profileContentLoading);
   }, [iconsLoaded, loading, profileContentLoading])




   return (
      <div className={`${styles.profile} page`}>
         {
            ((loading
               && (
                  (!trySignIn && (profileInfoMode === "pageView"))
               ))
               || !iconsLoaded
               || (profileContentLoading && profileMode === "loggedIn")) && !loadInfo.error && !postsLoadInfo.error
               ? (
                  <div className={`${styles.loading} pagePart`} >
                     <Preloader containerStyle={{ margin: "0 auto 0 auto" }} />
                  </div>
               ) : null
         }
         {
            loadInfo.error
               && (!errorTypes.includes(loadInfo.errorType as string))
               && !trySignIn
               ? <ErrorPage setTrySignIn={setTrySignIn} />
               : (
                  (profileMode === "loggedIn"
                     || profileMode === "loggedOut")
                     ? <ProfilePage />
                     : (profileMode === "loggedInAsGuest"
                        || profileMode === "guestSignIn")
                        ? <GuestPage />
                        : profileMode === "signIn"
                           ? <SignIn />
                           : null
               )
         }
         <IconsThatAreLoaded
            icons={icons}
            setIconsLoaded={setIconsLoaded}
         />
      </div>
   )
}




export default Profile