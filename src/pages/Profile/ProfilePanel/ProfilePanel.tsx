import { CustomImage } from '../../../common'
import Parameter from './Parameter'
import styles from './ProfilePanel.module.scss'
import { useRef, useEffect, useState } from 'react';
import { Popup, usePopupElement } from '../../../hooks';


type Props = {
}

type AvatarWrapperStyle = {
   overflow: "hidden" | "visible",
   borderRadius: string,
}


const ProfilePanel = (props: Props) => {
   const parameters: string[] = ["location", "education", "dateOfBirth", "email"]
   const profileInfo: { [prop: string]: string } = {
      username: "Ivan Ivanov",
      email: "ivanovivannnnnnnnnnnnnnnnnnnnn@mail.ru",
      location: "Russia, Moscowwwwwwwwwwwwwwwwwwwww",
      education: "Lomonosov MSUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
      dateOfBirth: "03.05.1995",
   }


   // consts
   const avatarWrapperStyle: AvatarWrapperStyle = {
      overflow: 'hidden',
      borderRadius: "0.6rem",
   }

   const parametersIcon: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
   const menu: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
   const prompt: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

   const [showPropmpt, setShowPropmpt] = useState<boolean>(false)


   // popup elements
   const popupMenu: Popup = usePopupElement(menu, true)
   const popupPrompt: Popup = usePopupElement(prompt)


   // funcs
   const showMenu = (): void => {
      popupMenu.showElementWithTimeout(400)
   }

   const hideMenu = (): void => {
      popupMenu.hideElementWithTimeout(400)
   }


   return (
      <div className={styles.profilePanel}>
         <CustomImage additionalClass={styles.avatar} src='./image/defaultAvatar.jpg' wrapperStyle={avatarWrapperStyle} />
         <div className={styles.profileInfo}>
            <div className={styles.header}>
               {
                  showPropmpt
                     ? (<div ref={prompt} className={styles.prompt}>
                        Double click to copy the parameter value
                     </div>)
                     : undefined
               }
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
                           <li className={styles.listItem}>
                              <img className={styles.listItemIcon} src="./icons/editBlack.svg" alt="edit icon" />
                              Edit
                           </li>
                           <li className={styles.listItem}>
                              <img className={styles.listItemIcon} src="./icons/passwordBlack.svg" alt="edit icon" />
                              Change password
                           </li>
                           <li className={styles.listItem}>
                              <img onLoad={() => popupMenu.setContentLoaded(true)} className={styles.listItemIcon} src="./icons/signOutBlack.svg" alt="edit icon" />
                              Sign out
                           </li>
                        </ul>
                     </div>)
                     : null
               }
            </div>
            <div className={styles.parameters}>
               {parameters.map((item: string) => <Parameter
                  key={item}
                  parameterName={item}
                  parameterValue={profileInfo[item]}
                  setShowPropmpt={setShowPropmpt}
                  popup={popupPrompt}
               />)}
            </div>
         </div>
      </div >
   )
}

export default ProfilePanel