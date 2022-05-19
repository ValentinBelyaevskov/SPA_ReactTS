import { Popup } from 'hooks'
import styles from './Menu.module.scss'
import React from 'react';
import MenuItem from './MenuItem';
import { EditMode } from '../ProfilePanel';



type Props = {
   menuRef: React.RefObject<HTMLDivElement>,
   showMenu: () => void,
   hideMenu: () => void,
   popupMenu: Popup,
   setEditMode: (editMode: EditMode) => void
   hideMenuOnTouchStart: () => void
}



const Menu = (props: Props) => {
   const menuButtons: ("edit" | "changePassword" | "signOut")[] = ["edit", "changePassword", "signOut"];



   return (
      <div
         className={`${styles.menu} profilePanelMenuElement`}
         ref={props.menuRef}
         onMouseEnter={props.showMenu}
         onMouseLeave={props.hideMenu}
      >
         <ul className={styles.list}>
            {menuButtons.map((item, index: number, array) => {
               return (
                  <MenuItem
                     key={item}
                     item={item}
                     index={index}
                     arrayLength={array.length}
                     setEditMode={props.setEditMode}
                     hideMenuOnTouchStart={props.hideMenuOnTouchStart}
                     popupMenu={props.popupMenu}
                  />
               )
            })}
         </ul>
      </div>
   )
}

export default Menu