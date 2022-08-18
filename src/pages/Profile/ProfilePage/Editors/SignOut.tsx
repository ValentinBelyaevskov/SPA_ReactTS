import styles from './Editor.module.scss';
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { getLoadInfo, profileActions, logout, getProfileMode } from '../../redux/profileReducer';
import { useEffect, useState } from 'react';
import { Button } from '../../../../common';
import { usePopupForm } from 'hooks/usePopup/usePopupForm';



interface Props {
   finishShowingThePopup: () => void,
}



const SignOut = (props: Props) => {
   const profileMode = useAppSelector(getProfileMode);
   const loadInfo = useAppSelector(getLoadInfo);
   const dispatch = useAppDispatch();
   const popupForm = usePopupForm(endEditingCallback);
   const [popupHasBeenMounted, setPopupHasBeenMounted] = useState<boolean>(false);
   const profileLogout = () => dispatch(logout());



   function endEditingCallback(): void {
      props.finishShowingThePopup();
      if (profileMode === "loggedOut") dispatch(profileActions.resetProfileInfo("signIn"));
   }

   const saveButtonClickListener = (e: React.MouseEvent) => {
      profileLogout();
      popupForm.setClickedButtonName(e);
   }

   const closeButtonClickListener = (e: React.MouseEvent) => {
      if (!popupHasBeenMounted) return;

      popupForm.hideEditorStyle();
      popupForm.setClickedButtonName(e);
      dispatch(profileActions.setLoadInfo({
         error: undefined,
         errorType: undefined,
         loaded: loadInfo.loaded,
         loading: false,
      }))
   }



   useEffect(() => {
      if (profileMode === "loggedOut") {
         popupForm.hideEditorStyle();
      }
   }, [profileMode]);



   return (
      <div
         style={popupForm.editorStyle}
         onAnimationEndCapture={() => setPopupHasBeenMounted(true)}
         onTransitionEnd={popupForm.transitionEndListener}
         className={`${styles.editor} ${styles.signOutEditor} editor`}
      >
         <div className={styles.signOutBody}>
            {
               loadInfo.loading && (
                  <div className={styles.preloaderContainer}>
                     <div className={styles.preloaderSubContainer}>
                        <img src="./animatedIcons/preloader2_white.svg" alt="preloader" />
                     </div>
                  </div>
               )
            }
            <h2 className={styles.title}>
               Are you sure you want Sign out?
            </h2>
            {
               loadInfo.error ? <div className={`${styles.warning} ${styles.errorWarning}`}>{`${loadInfo.error}`}</div>
                  : null
            }
            <div className={styles.buttons}>
               <Button
                  params={
                     {
                        containerClassName: `signOutButtonContainer ${styles.formButtonContainer}`,
                        clickListener: saveButtonClickListener,
                        text: "Sign out",
                        type: "submit",
                        color: "red",
                        buttonClassName: `${styles.formButton} signOutButton`,
                        changeStyleOnHover: true
                     }
                  }
               />
               <Button
                  params={
                     {
                        containerClassName: `closeButtonContainer ${styles.formButtonContainer}`,
                        clickListener: closeButtonClickListener,
                        text: "Close",
                        type: "button",
                        buttonClassName: `${styles.formButton} closeButton`,
                        changeStyleOnHover: true
                     }
                  }
               />
            </div>
         </div>
      </div>
   )
}



export default SignOut