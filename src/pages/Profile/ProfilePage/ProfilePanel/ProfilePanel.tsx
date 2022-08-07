import styles from './ProfilePanel.module.scss';
import { useState, useEffect, useRef, useContext } from 'react';
import { getLoadInfo, getProfileInfo, profileActions, uploadAvatar } from '../../redux/profileReducer';
import { Profile } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import ChangePasswordForm from '../Editors/ChangePasswordForm';
import SignOut from '../Editors/SignOut';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { CustomImage } from 'common';
import Header from './Header/Header';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import { Popup, usePopupElement } from 'hooks';
import { useElementTouchStartListener } from 'hooks/usePopup/useElementTouchStartListener';
import { AppContext, PopupContext } from '../../../../App';
import SelectAndEditAnImageForm from 'common/UploadFormsAndLightbox/SelectAndEditAnImageForm';
import PostEditPanel from 'common/PostEditPanel/PostEditPanel';
import ChangeProfileInfoForm from '../Editors/ChangeProfileInfoForm';



export type EditMode = "edit" | "changePassword" | "signOut" | "changeAvatar" | undefined;



const ProfilePanel = () => {
   const dispatch = useAppDispatch();
   const editIcons: string[] = [
      "./icons/showPasswordIcon.svg",
      "./icons/hidePasswordIcon.svg"
   ];
   const loadInfo = useAppSelector(getLoadInfo);
   const profileInfo: Profile = useAppSelector(getProfileInfo);
   const [editMode, setEditMode] = useState<EditMode>(undefined);
   const [editIconsLoaded, setEditIconsLoaded] = useState<boolean>(false);
   const avatarPromptRef = useRef<HTMLDivElement>(null);
   const popupAvatarPrompt: Popup = usePopupElement(avatarPromptRef, false);

   const {
      elementTouchStartListener,
      enableTouchEventsSimulation,
      setShowElementOnTouchStart,
      elementHoverAndTouchClassName,
      elementClickListener,
      elementMouseEnterListener,
      resetElementHoverClassName,
      elementTouchEndListener,
      resetShowElementOnTouchEvent
   } = useElementTouchStartListener(styles.touch, styles.hover, ".showPopupAvatarPromptElement", popupAvatarPrompt, [0, 0]);
   const [showChangeAvatarButton, setShowChangeAvatarButton] = useState<boolean>(false);
   const [changeAvatarButtonStyle, setChangeAvatarButtonStyle] = useState<{ opacity?: string }>({});
   const popupContext = useContext(PopupContext);
   const appContext = useContext(AppContext);



   const avatarPromptClickListener = (e: React.MouseEvent): void => {
      setEditMode("changeAvatar");
      resetShowElementOnTouchEvent();
   }

   const AvatarPrompt = () => (
      <div ref={avatarPromptRef} className={`${styles.avatarInscriptionContainer} unselectable`} >
         {
            showChangeAvatarButton ?
               (<div
                  style={changeAvatarButtonStyle}
                  className={`${styles.avatarInscription} ${styles.showPopupAvatarPromptElement} showPopupAvatarPromptElement unselectable`}
                  onClick={avatarPromptClickListener}
               >
                  Change avatar
               </div>)
               : null
         }
      </div>
   )

   const finishEditing: () => void = () => {
      setEditMode(undefined);
      appContext.setPopup!(undefined);
   }

   const showPopupAvatarPrompt = (): void => {
      popupAvatarPrompt.showElementWithTimeout(0);
      setShowElementOnTouchStart(false);
      elementMouseEnterListener();
   }

   const hidePopupAvatarPrompt = (): void => {
      popupAvatarPrompt.hideElementWithTimeout(0);
      setShowElementOnTouchStart(true);
      enableTouchEventsSimulation();
      resetElementHoverClassName();
   }

   const changeAvatarFormSubmitListener = (croppedImage: File | null, callback: () => void): void => {
      dispatch(uploadAvatar({
         file: croppedImage!,
         typeOfFile: "avatar",
         callback,
         objectId: profileInfo.objectId,
         avatar: profileInfo.avatar,
      }));
      dispatch(profileActions.setLoadInfo({
         ...loadInfo,
         loaded: false,
         loading: true,
      }));
   }



   useEffect(() => {
      if (popupAvatarPrompt.needToShowElement) {
         setTimeout(() => {
            setShowChangeAvatarButton(true);
            setTimeout(() => setChangeAvatarButtonStyle({ opacity: "1" }), 0);
         }, 100)
      } else {
         setShowChangeAvatarButton(false);
         setChangeAvatarButtonStyle({});
      }
   }, [popupAvatarPrompt.needToShowElement])

   useEffect(() => {
      if (editMode) {
         dispatch(profileActions.setProfileInfoMode("edit"));
      }
      return () => {
         dispatch(profileActions.setProfileInfoMode("view"));
      }
   }, [editMode])

   useEffect(() => {
      if (editMode) {
         popupContext.setNeedToShowPopup!(true);
      } else {
         popupContext.setNeedToShowPopup!(false);
      }
   }, [editMode])

   useEffect(() => {
      if (editMode === "edit") {
         appContext.setPopup!(<ChangeProfileInfoForm finishEditing={finishEditing} />)
      } else if ((editMode === "changePassword") && editIconsLoaded) {
         appContext.setPopup!(<ChangePasswordForm finishEditing={finishEditing} />)
      } else if (editMode === "signOut") {
         appContext.setPopup!(<SignOut finishEditing={finishEditing} />)
      } else if (editMode === "changeAvatar") {
         appContext.setPopup!(< SelectAndEditAnImageForm
            finishEditing={finishEditing}
            imageAspect={1 / 1}
            loadInfo={loadInfo}
            submitListener={changeAvatarFormSubmitListener}
            uploadUncroppedImage={false}
            uploadButtonText="Upload new avatar"
            popupText='Update avatar:'
         />)
      } else {
         appContext.setPopup!(undefined)
      }
   }, [editMode, editIconsLoaded, loadInfo.loading])



   return (
      <div className={`${styles.profilePanel} pagePart`}>
         <div className={styles.panelGridContainer}>
            <CustomImage
               additionalClass={`${styles.avatar} ${elementHoverAndTouchClassName} showPopupAvatarPromptElement unselectable`}
               additionalImageClass={`showPopupAvatarPromptElement unselectable`}
               src={profileInfo.avatar ? profileInfo.avatar : "./image/defaultAvatar.jpg"}
               onClick={elementClickListener}
               onMouseEnter={showPopupAvatarPrompt}
               onMouseLeave={hidePopupAvatarPrompt}
               onTouchStart={elementTouchStartListener}
               onTouchEnd={() => elementTouchEndListener()}
               jsx={popupAvatarPrompt.needToShowElement ? AvatarPrompt() : undefined}
            />
            <Header
               username={`${profileInfo.firstName} ${profileInfo.lastName}`}
               setEditMode={setEditMode}
            />
            <ProfileInfo
               profileInfo={profileInfo}
            />
            <PostEditPanel
               containerClassName={styles.panelForCreatingAPost}
               mode="edit"
               audioPlayerContext='createAPost'
            />
         </div>
         <IconsThatAreLoaded
            icons={editIcons}
            setIconsLoaded={setEditIconsLoaded}
         />
      </div >
   )
}



export default ProfilePanel