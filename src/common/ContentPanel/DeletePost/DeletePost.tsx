import styles from './DeletePost.module.scss';
import { usePopupForm } from 'hooks/usePopup/usePopupForm';
import Button from 'common/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { deletePost, getLoadInfo, profileActions } from 'pages/Profile/redux/profileReducer';
import { useEffect, useState } from 'react';




interface Props {
   finishShowingThePopup: () => void,
   finishShowingDeleteWindow: () => void
   postId: string
   profileId: string
   allPostIds: string[]
}




const DeletePost = (props: Props) => {
   const loadInfo = useAppSelector(getLoadInfo);
   const dispatch = useAppDispatch();
   const popupForm = usePopupForm(endEditingCallback);
   const [popupHasBeenMounted, setPopupHasBeenMounted] = useState<boolean>(false);




   function endEditingCallback(): void {
      if (popupForm.clickedButton) {
         if (popupForm.clickedButton.includes("closeButton")) {
            props.finishShowingThePopup();
         } else if (popupForm.clickedButton.includes("signOutButton")) {
            props.finishShowingDeleteWindow();
         }
      }
   }

   const deleteButtonClickListener = (e: React.MouseEvent) => {
      popupForm.setClickedButtonName(e);

      dispatch(
         deletePost({
            callback: popupForm.hideEditorStyle,
            postId: props.postId,
            profileId: props.profileId,
            allPostIds: props.allPostIds
         })
      )
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
                        clickListener: deleteButtonClickListener,
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




export default DeletePost