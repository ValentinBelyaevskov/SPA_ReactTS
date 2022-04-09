import styles from './Editor.module.scss';
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { getLoadInfo, profileActions, logout, getProfileMode } from '../../redux/profileReducer';
import { useState, useEffect } from 'react';
import { Button } from '../../../../common';


// types
interface Props {
   finishEditing: () => void,
}

interface LocalState {
   editorStyle: { opacity: number },
   clickedButton: string | undefined,
}


const SignOut = (props: Props) => {
   // hooks
   const profileMode = useAppSelector(getProfileMode);

   const loadInfo = useAppSelector(getLoadInfo);

   const dispatch = useAppDispatch();

   const [localState, setLocalState] = useState<LocalState>({
      editorStyle: { opacity: 1 },
      clickedButton: undefined,
   })

   const profileLogout = () => dispatch(logout());

   useEffect(() => {
      if (profileMode === "loggedOut") {
         hideEditorStyle();
      }
   }, [profileMode]);


   // funcs
   const hideEditorStyle = (): void => {
      setLocalState({ ...localState, editorStyle: { opacity: 0 } })
   }

   const transitionEndListener = (e: React.TransitionEvent): void => {
      if (e.currentTarget === e.target) {
         props.finishEditing();
      }
      if (profileMode === "loggedOut") dispatch(profileActions.resetProfileInfo("signIn"));
   }

   const setClickedButtonName = (e: React.MouseEvent): void => {
      localState.clickedButton = e.currentTarget.classList[e.currentTarget.classList.length - 1]
      if (e.currentTarget.classList.contains("closeButton")) {
         dispatch(profileActions.setLoadInfo({
            error: undefined,
            errorType: undefined,
            loaded: false,
            loading: false,
         }))
      }
   }


   return (
      <div style={localState.editorStyle} onTransitionEnd={transitionEndListener} className={`${styles.editor} editor`}>
         <div className={styles.signOutBody}>
            <h2 className={styles.title}>
               Are you sure you want Sign out?
            </h2>
            {
               loadInfo.loading ? <div className={`${styles.warning} ${styles.loadingWarning}`}>Loading...</div>
                  : loadInfo.error ? <div className={`${styles.warning} ${styles.errorWarning}`}>{`${loadInfo.error}`}</div>
                     : null
            }
            <div className={styles.buttons}>
               <Button
                  params={
                     {
                        containerClassName: "saveButtonContainer",
                        clickHandler: (e) => {profileLogout(); setClickedButtonName(e)},
                        text: "Sign out",
                        type: "submit",
                        color: "red",
                        buttonClassName: `${styles.formButton}`,
                     }
                  }
               />
               <Button
                  params={
                     {
                        containerClassName: "closeButtonContainer",
                        clickHandler: (e) => { hideEditorStyle(); setClickedButtonName(e) },
                        text: "Close",
                        type: "button",
                        buttonClassName: `${styles.formButton} closeButton`,
                     }
                  }
               />
            </div>
         </div>
      </div>
   )
}

export default SignOut