import styles from './DeletePost.module.scss';
import { useEffect } from 'react';
import { usePopupForm } from 'hooks/usePopup/usePopupForm';
import Button from 'common/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { getLoadInfo, getProfileMode, logout, profileActions } from 'pages/Profile/redux/profileReducer';




interface Props {
   finishShowingThePopup: () => void,
   postId: string
   profileId: string
   allPostIds: string[]
}




const DeletePost = (props: Props) => {
   const profileMode = useAppSelector(getProfileMode);
   const loadInfo = useAppSelector(getLoadInfo);
   const dispatch = useAppDispatch();
   const popupForm = usePopupForm(endEditingCallback);
   const profileLogout = () => dispatch(logout());




   function endEditingCallback(): void {
      props.finishShowingThePopup();
   }

   const deleteButtonClickListener = (e: React.MouseEvent) => {
      profileLogout();
      popupForm.setClickedButtonName(e);

      // dispatch(
      //    actionCreator(
      //       callback: popupForm.hideEditorStyle(),
      //       postId: props.postId,
      //       profileId: props.profileId,
      //       allPostIds: props.allPostIds
      //    )
      // )
   }

   const closeButtonClickListener = (e: React.MouseEvent) => {
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
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor} ${styles.signOutEditor} editor`}>
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
               Are you sure you want to delete the post?
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
                        clickHandler: deleteButtonClickListener,
                        text: "DeletePost Post",
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
                        clickHandler: closeButtonClickListener,
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




export default DeletePost