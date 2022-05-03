import styles from './ProfilePanel.module.scss';
import { useState, useEffect, useRef, useContext } from 'react';
import { getProfileInfo, getProfileInfoMode, profileActions } from '../../redux/profileReducer';
import { Profile } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import ChangeProfileInfoForm from '../Editors/ChangeProfileInfoForm';
import ChangePasswordForm from '../Editors/ChangePasswordForm';
import SignOut from '../Editors/SignOut';
import ChangeAvatarForm from '../Editors/ChangeAvatarForm';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { CustomImage } from 'common';
import Header from './Header';
import ProfileInfo from './ProfileInfo';
import { Popup, usePopupElement } from 'hooks';
import { useElementTouchStartListener } from 'hooks/usePopup/useElementTouchStartListener';
import { PopupContext } from '../../../../App';



type EditMode = "edit" | "changePassword" | "signOut" | "changeAvatar" | false;



const ProfilePanel = () => {
   const dispatch = useAppDispatch();
   const editIcons: string[] = [
      "./icons/showPasswordIcon.svg",
      "./icons/hidePasswordIcon.svg"
   ];
   const profileInfo: Profile = useAppSelector(getProfileInfo);
   const profileInfoMode: string = useAppSelector(getProfileInfoMode);
   const [pagePartEditClass, setPagePartEditClass] = useState<string>("");
   const [editMode, setEditMode] = useState<EditMode>(false);
   const [editIconsLoaded, setEditIconsLoaded] = useState<boolean>(false);
   const avatarPromptRef = useRef<HTMLDivElement>(null);
   const popupAvatarPrompt: Popup = usePopupElement(avatarPromptRef, false);
   const {
      elementTouchStartListener,
      enableTouchEventsSimulation,
      setShowElementOnTouchStart,
      elementHoverAndTouchClassName,
      setElementHoverClassName,
      resetElementHoverClassName,
      resetElementTouchClassName,
      resetShowElementOnTouchEvent
   } = useElementTouchStartListener(popupAvatarPrompt, styles.touch, styles.hover, ".showPopupAvatarPromptElement");
   const [showChangeAvatarButton, setShowChangeAvatarButton] = useState<boolean>(false);
   const [changeAvatarButtonStyle, setChangeAvatarButtonStyle] = useState<{ opacity?: string }>({});
   const popupContext = useContext(PopupContext);



   const avatarPromptClickListener = (e: React.MouseEvent): void => {
      setEditMode("changeAvatar");
      resetShowElementOnTouchEvent();
   }

   const AvatarPrompt = () => (
      <div ref={avatarPromptRef} className={`${styles.avatarInscriptionContainer} unselectable`} >
         {
            showChangeAvatarButton ?
               (<div style={changeAvatarButtonStyle} className={`${styles.avatarInscription} ${styles.showPopupAvatarPromptElement}`} onClick={avatarPromptClickListener}>
                  Change avatar
               </div>)
               : null
         }
      </div>
   )

   const finishEditing: () => void = () => setEditMode(false);

   const showPopupAvatarPrompt = (): void => {
      popupAvatarPrompt.showElementWithTimeout(0);
      setShowElementOnTouchStart(false);
      setElementHoverClassName();
   }

   const hidePopupAvatarPrompt = (): void => {
      popupAvatarPrompt.hideElementWithTimeout(0);
      setShowElementOnTouchStart(true);
      enableTouchEventsSimulation();
      resetElementHoverClassName();
   }



   useEffect(() => {
      if (popupAvatarPrompt.needToShowElement) {
         setTimeout(() => {
            setShowChangeAvatarButton(true);
            setTimeout(() => setChangeAvatarButtonStyle({ opacity: "1" }), 0)
         }, 100)
      } else {
         setShowChangeAvatarButton(false)
         setChangeAvatarButtonStyle({})
      }
   }, [popupAvatarPrompt.needToShowElement])

   useEffect(() => {
      if (editMode) {
         dispatch(profileActions.setProfileInfoMode("edit"));
      }
      return () => {
         dispatch(profileActions.setProfileInfoMode("view"));
      }
   }, [editMode]);

   useEffect(() => {
      if (profileInfoMode === "edit") {
         setPagePartEditClass(styles.pagePartEditClass);
      } else {
         setPagePartEditClass("");
      }
   }, [profileInfoMode]);

   useEffect(() => {
      if (editMode) {
         popupContext.setNeedToShowPopup!(true);
      } else {
         popupContext.setNeedToShowPopup!(false);
      }
   }, [editMode]);



   return (
      <div className={`${styles.profilePanel} ${pagePartEditClass} pagePart`}>
         <div className={styles.panelGridContainer}>
            <CustomImage
               additionalClass={`${styles.avatar} ${elementHoverAndTouchClassName} unselectable`}
               src={profileInfo.avatar ? profileInfo.avatar : "./image/defaultAvatar.jpg"}
               onMouseEnter={showPopupAvatarPrompt}
               onMouseLeave={hidePopupAvatarPrompt}
               onTouchStart={elementTouchStartListener}
               onTouchEnd={() => resetElementTouchClassName(true)}
               jsx={popupAvatarPrompt.needToShowElement ? AvatarPrompt() : undefined}
            />
            <Header
               username={profileInfo.username}
               setEditMode={setEditMode}
            />
            <ProfileInfo
               profileInfo={profileInfo}
            />
         </div>
         {
            editMode === "edit"
               ? <ChangeProfileInfoForm finishEditing={finishEditing} />
               : (editMode === "changePassword") && editIconsLoaded
                  ? <ChangePasswordForm finishEditing={finishEditing} />
                  : editMode === "signOut"
                     ? <SignOut finishEditing={finishEditing} />
                     : editMode === "changeAvatar"
                        ? <ChangeAvatarForm finishEditing={finishEditing} />
                        : null
         }
         <IconsThatAreLoaded
            icons={editIcons}
            setIconsLoaded={setEditIconsLoaded}
         />
      </div >
   )
}



export default ProfilePanel