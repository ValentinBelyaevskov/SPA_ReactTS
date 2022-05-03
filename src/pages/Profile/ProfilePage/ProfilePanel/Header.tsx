import { Popup, usePopupElement } from 'hooks';
import React, { useRef } from 'react';
import styles from './Header.module.scss';
import profilePanelStyles from './ProfilePanel.module.scss';
import Menu from './Menu';
import { useElementTouchStartListener } from 'hooks/usePopup/useElementTouchStartListener';



type EditMode = "edit" | "changePassword" | "signOut" | "changeAvatar" | false

type Props = {
   username: string
   setEditMode: React.Dispatch<React.SetStateAction<EditMode>>
}



const Header = (props: Props) => {
   const personalParametersIcon: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const menu: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const popupMenu: Popup = usePopupElement(menu, true);
   const {
      elementTouchStartListener,
      enableTouchEventsSimulation,
      setShowElementOnTouchStart,
      elementHoverAndTouchClassName,
      resetElementTouchClassName,
      setElementHoverClassName,
      resetElementHoverClassName,
      resetShowElementOnTouchEvent
   } = useElementTouchStartListener(popupMenu, styles.touch, styles.hover, ".profilePanelMenuElement");



   const showMenu = (): void => {
      popupMenu.showElementWithTimeout(200);
      setShowElementOnTouchStart(false);
      setElementHoverClassName();
   }

   const hideMenu = (): void => {
      popupMenu.hideElementWithTimeout(200);
      setShowElementOnTouchStart(true);
      enableTouchEventsSimulation();
      resetElementHoverClassName();
   }



   return (
      <div className={`${profilePanelStyles.header} ${styles.header}`}>
         <h3 className={styles.username}>
            {props.username}
         </h3>
         <div
            className={`${styles.parametersIcon} ${elementHoverAndTouchClassName} profilePanelMenuElement unselectable`}
            ref={personalParametersIcon}
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
            onTouchStart={elementTouchStartListener}
            onTouchEnd={() => resetElementTouchClassName(true)}
         >
            <img src="./icons/other.svg" alt="Set personalParameters icon" />
         </div>
         {
            popupMenu.needToShowElement
               ? (
                  <Menu
                     hideMenu={hideMenu}
                     popupMenu={popupMenu}
                     menuRef={menu}
                     setEditMode={props.setEditMode}
                     showMenu={showMenu}
                     hideMenuOnTouchStart={resetShowElementOnTouchEvent}
                  />
               )
               : null
         }
      </div>
   )
}



export default Header