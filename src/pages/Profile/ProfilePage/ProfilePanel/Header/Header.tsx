import { Popup, usePopupElement } from 'hooks';
import React, { useRef } from 'react';
import styles from './Header.module.scss';
import profilePanelStyles from '../ProfilePanel.module.scss';
import Menu from './Menu';
import { useElementTouchStartListener } from 'hooks/usePopup/useElementTouchStartListener';
import { EditMode } from '../ProfilePanel';



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
      elementHoverAndTouchClassName,
      elementClickListener,
      elementTouchEndListener,
      resetShowElementOnTouchEvent,
      showElement,
      hideElement
   } = useElementTouchStartListener(styles.touch, styles.hover, ".profilePanelMenuElement", popupMenu, [250, 200]);



   return (
      <div className={`${profilePanelStyles.header} ${styles.header}`}>
         <h3 className={styles.username}>
            {props.username}
         </h3>
         <div
            className={`${styles.parametersIcon} ${elementHoverAndTouchClassName} profilePanelMenuElement unselectable`}
            ref={personalParametersIcon}
            onClick={elementClickListener}
            onMouseEnter={showElement}
            onMouseLeave={hideElement}
            onTouchStart={elementTouchStartListener}
            onTouchEnd={elementTouchEndListener}
         >
            <img src="./icons/other.svg" alt="Set personalParameters icon" />
         </div>
         {
            popupMenu.needToShowElement
               ? (
                  <Menu
                     hideMenu={hideElement}
                     popupMenu={popupMenu}
                     menuRef={menu}
                     setEditMode={props.setEditMode}
                     showMenu={showElement}
                     hideMenuOnTouchStart={resetShowElementOnTouchEvent}
                  />
               )
               : null
         }
      </div>
   )
}



export default Header