import { CustomImage } from '../../../../common';
import Parameter from './Parameter';
import styles from './ProfilePanel.module.scss';
import { useRef, useState, useEffect } from 'react';
import { Popup, usePopupElement } from '../../../../hooks';
import { getProfileInfo, getProfileInfoMode, profileActions } from '../../redux/profileReducer';
import { Profile } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { splitStringIntoWords } from '../../../../functions';
import ChangeProfileInfoForm from '../Editors/ChangeProfileInfoForm';
import ChangePasswordForm from '../Editors/ChangePasswordForm';
import SignOut from '../Editors/SignOut';
import ChangeAvatarForm from '../Editors/ChangeAvatarForm';


type AvatarWrapperStyle = {
   overflow: "hidden" | "visible",
   borderRadius: string,
}

type EditMode = "edit" | "changePassword" | "signOut" | "changeAvatar" | false

type PagePartStyle = {
   paddingTop: "27px",
} | {}


const ProfilePanel = () => {
   // consts
   const dispatch = useAppDispatch();

   const menuButtons: ("edit" | "changePassword" | "signOut")[] = ["edit", "changePassword", "signOut"]
   const avatarWrapperStyle: AvatarWrapperStyle = {
      overflow: 'hidden',
      borderRadius: "0.6rem",
   }
   
   const [editMode, setEditMode] = useState<EditMode>(false)
   const [pagePartStyle, setPagePartStyle] = useState<PagePartStyle>({});
   const profileInfo: Profile = useAppSelector(getProfileInfo)
   const profileInfoMode: string = useAppSelector(getProfileInfoMode);
   const parameters: [string, string | undefined | number | null][] = [
      ["email", profileInfo.email],
      ["location", profileInfo.location],
      ["education", profileInfo.education],
      ["dateOfBirth", profileInfo.dateOfBirth],
   ]

   const menu: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
   const parametersIcon: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

   // popup elements
   const popupMenu: Popup = usePopupElement(menu, true)


   // effects
   useEffect(() => {
      if (editMode) {
         dispatch(profileActions.setProfileInfoMode("edit"))
      }

      return () => {
         dispatch(profileActions.setProfileInfoMode("view"))
      }
   }, [editMode])

   useEffect(() => {
      if (profileInfoMode === "edit") {
         setPagePartStyle({
            paddingTop: "27px",
         })
      } else {
         setPagePartStyle({})
      }
   }, [profileInfoMode]);


   // funcs
   const finishEditing: () => void = () => setEditMode(false)

   const showMenu = (): void => {
      popupMenu.showElementWithTimeout(200)
   }

   const hideMenu = (): void => {
      popupMenu.hideElementWithTimeout(200)
   }


   return (
      <div className={`${styles.profilePanel} pagePart`} style={pagePartStyle}>
         <CustomImage
            width='135px'
            height='135px'
            additionalClass={styles.avatar}
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
                  className={styles.setParametersIcon}
                  ref={parametersIcon}
                  onMouseEnter={showMenu}
                  onMouseLeave={hideMenu}
               >
                  <img src="./icons/other.svg" alt="Set parameters icon" />
               </div>
               {
                  popupMenu.needToShowElement
                     ? (<div
                        className={styles.menu}
                        ref={menu}
                        onMouseEnter={showMenu}
                        onMouseLeave={hideMenu}
                     >
                        <ul className={styles.list}>
                           {menuButtons.map((item, index: number, array) => {
                              return (
                                 <li
                                    className={styles.listItem}
                                    key={item}
                                    onClick={() => setEditMode(item)}
                                 >
                                    {
                                       index === array.length - 1
                                          ? <img
                                             onLoad={() => popupMenu.setContentLoaded(true)}
                                             className={styles.listItemIcon}
                                             src={`./icons/${item}Black.svg`}
                                             alt={`${item} icon`}
                                          />
                                          : <img
                                             className={styles.listItemIcon}
                                             src={`./icons/${item}Black.svg`}
                                             alt={`${item} icon`}
                                          />
                                    }
                                    {splitStringIntoWords(item as string, true)}
                                 </li>
                              )
                           })}
                        </ul>
                     </div>)
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