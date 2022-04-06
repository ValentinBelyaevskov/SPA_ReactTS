import { Popup } from 'hooks'
import styles from './Menu.module.scss'
import React from 'react';
import { splitStringIntoWords } from 'functions';


type EditMode = "edit" | "changePassword" | "signOut" | "changeAvatar" | false

type Props = {
   menuRef: React.RefObject<HTMLDivElement>,
   showMenu: () => void,
   hideMenu: () => void,
   popupMenu: Popup,
   setEditMode: React.Dispatch<React.SetStateAction<EditMode>>
}


const Menu = (props: Props) => {
   const menuButtons: ("edit" | "changePassword" | "signOut")[] = ["edit", "changePassword", "signOut"]


   return (
      <div
         className={styles.menu}
         ref={props.menuRef}
         onMouseEnter={props.showMenu}
         onMouseLeave={props.hideMenu}
      >
         <ul className={styles.list}>
            {menuButtons.map((item, index: number, array) => {
               return (
                  <li
                     className={styles.listItem}
                     key={item}
                     onClick={() => props.setEditMode(item)}
                  >
                     {
                        index === array.length - 1
                           ? <img
                              onLoad={() => props.popupMenu.setContentLoaded(true)}
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
      </div>
   )
}

export default Menu