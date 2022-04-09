import { CustomImage } from '../../../../common';
import Parameter from './Parameter';
import styles from './ProfilePanel.module.scss';
import { useRef, useState, useEffect } from 'react';
import { Popup, usePopupElement } from '../../../../hooks';
import { getProfileInfo, getProfileInfoMode, profileActions } from '../../redux/profileReducer';
import { Profile } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import ChangeProfileInfoForm from '../Editors/ChangeProfileInfoForm';
import ChangePasswordForm from '../Editors/ChangePasswordForm';
import SignOut from '../Editors/SignOut';
import ChangeAvatarForm from '../Editors/ChangeAvatarForm';
import Menu from './Menu';
import { useTouchEvents } from 'hooks/useTouchEvents';


type AvatarWrapperStyle = {
   overflow: "hidden" | "visible",
   borderRadius: string,
}

type EditMode = "edit" | "changePassword" | "signOut" | "changeAvatar" | false

type PagePartStyle = {
   paddingTop?: "27px",
}


const ProfilePanel = () => {
   const avatarWrapperStyle: AvatarWrapperStyle = {
      overflow: 'hidden',
      borderRadius: "0.6rem",
   }

   const dispatch = useAppDispatch();
   const [showMenuOnTouchStart, setShowMenuOnTouchStart] = useState<boolean>(true);
   const [editMode, setEditMode] = useState<EditMode>(false);
   const [pagePartStyle, setPagePartStyle] = useState<PagePartStyle>({});
   const profileInfo: Profile = useAppSelector(getProfileInfo);
   const profileInfoMode: string = useAppSelector(getProfileInfoMode);
   const parameters: [string, string | undefined | number | null][] = [
      ["email", profileInfo.email],
      ["location", profileInfo.location],
      ["education", profileInfo.education],
      ["dateOfBirth", profileInfo.dateOfBirth],
   ]

   const menu: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const parametersIcon: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

   // custom hooks
   const popupMenu: Popup = usePopupElement(menu, true);
   const touchMove = useTouchEvents('touchmove', [".profilePanelMenuElement"], resetShowMenuOnTouchEvent);
   const touchStart = useTouchEvents('touchstart', [".profilePanelMenuElement"], resetShowMenuOnTouchEvent);

   // effects
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
         setPagePartStyle({
            paddingTop: "27px",
         });
      } else {
         setPagePartStyle({});
      }
   }, [profileInfoMode]);


   // funcs
   const addTouchEventListeners = (): void => {
      touchMove.removeEventListener();
      touchMove.addEventListener();
      touchStart.removeEventListener();
      touchStart.addEventListener();
   }

   const enableTouchEventsSimulation = (): void => {
      touchMove.enableEventSimulation();
      touchStart.enableEventSimulation();
   }

   function resetShowMenuOnTouchEvent(): void {
      popupMenu.hideElementWithTimeout(0);
      setShowMenuOnTouchStart(true);
   }

   const finishEditing: () => void = () => setEditMode(false);

   const showMenu = (): void => {
      popupMenu.showElementWithTimeout(200);
      setShowMenuOnTouchStart(false);
   }

   const hideMenu = (): void => {
      popupMenu.hideElementWithTimeout(200);
      setShowMenuOnTouchStart(true);
      enableTouchEventsSimulation();
   }

   const showMenuOnTouch = (): void => {
      popupMenu.showElementWithTimeout(0);
      setShowMenuOnTouchStart(false);
      addTouchEventListeners();
   }

   const hideMenuOnTouch = (): void => {
      popupMenu.hideElementWithTimeout(0);
      setShowMenuOnTouchStart(true);
      enableTouchEventsSimulation();
   }

   const menuIconTouchListener = (): void => {
      if (showMenuOnTouchStart) {
         showMenuOnTouch();
      } else {
         hideMenuOnTouch();
      }
   }


   return (
      <div className={`${styles.profilePanel} pagePart`} style={pagePartStyle}>
         <div className={styles.panelFlexContainer}>
            <CustomImage
               width='135px'
               height='135px'
               additionalClass={styles.bigAvatar}
               src={profileInfo.avatar ? profileInfo.avatar : "./image/defaultAvatar.jpg"}
               wrapperStyle={avatarWrapperStyle}
               onClick={() => setEditMode("changeAvatar")}
            />
            <div className={styles.profileInfo}>
               <div className={styles.header}>
                  <h3 className={styles.username}>
                     {profileInfo.username}
                  </h3>
                  <div
                     className={`${styles.parametersIcon} profilePanelMenuElement unselectable`}
                     ref={parametersIcon}
                     onMouseEnter={showMenu}
                     onMouseLeave={hideMenu}
                     onTouchStart={menuIconTouchListener}
                  >
                     <img src="./icons/other.svg" alt="Set parameters icon" />
                  </div>
                  {
                     popupMenu.needToShowElement
                        ? (
                           <Menu
                              hideMenu={hideMenu}
                              popupMenu={popupMenu}
                              menuRef={menu}
                              setEditMode={setEditMode}
                              showMenu={showMenu}
                              hideMenuOnTouchStart={resetShowMenuOnTouchEvent}
                           />
                        )
                        : null
                  }
               </div>
               <div className={styles.parameters}>
                  {parameters.map((item) => (
                     item[1]
                        ? <Parameter
                           key={item[0]}
                           parameterName={item[0]}
                           parameterValue={item[1]}
                        />
                        : null
                  ))}
               </div>
            </div>
         </div>
         {
            editMode === "edit"
               ? <ChangeProfileInfoForm finishEditing={finishEditing} />
               : editMode === "changePassword"
                  ? <ChangePasswordForm finishEditing={finishEditing} />
                  : editMode === "signOut"
                     ? <SignOut finishEditing={finishEditing} />
                     : editMode === "changeAvatar"
                        ? <ChangeAvatarForm finishEditing={finishEditing} />
                        : null
         }
      </div >
   )
}

export default ProfilePanel