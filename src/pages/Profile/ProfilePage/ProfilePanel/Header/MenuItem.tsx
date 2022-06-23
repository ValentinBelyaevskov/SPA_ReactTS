import { splitStringIntoWords } from 'functions'
import { Popup } from 'hooks'
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames'
import { EditMode } from '../ProfilePanel'
import styles from './MenuItem.module.scss'



type Props = {
   index: number
   arrayLength: number
   item: "edit" | "changePassword" | "signOut"
   setEditMode: (editMode: EditMode) => void
   hideMenuOnTouchStart: () => void
   popupMenu: Popup
}



const MenuItem = (props: Props) => {
   const itemHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);



   const itemTouchStartListener = () => {
      itemHoverAndTouchClassNames.touchStartListener();
   }

   const itemTouchEndListener = (item: "edit" | "changePassword" | "signOut"): void => {
      props.setEditMode(item);
      props.hideMenuOnTouchStart();
      itemHoverAndTouchClassNames.touchEndListener();
   }

   const itemMouseEnterListener = () => {
      itemHoverAndTouchClassNames.mouseEnterListener();
   }

   const itemClickListener = () => {
      itemHoverAndTouchClassNames.clickListener();
      props.hideMenuOnTouchStart();
      props.setEditMode(props.item);
   }



   return (
      <li
         className={`${styles.listItem} ${itemHoverAndTouchClassNames.className} unselectable`}
         key={props.item}
         onClick={itemClickListener}
         onMouseMove={itemMouseEnterListener}
         onTouchStart={itemTouchStartListener}
         onTouchEnd={() => itemTouchEndListener(props.item)}
      >
         {
            props.index === props.arrayLength - 1
               ? <img
                  onLoad={() => props.popupMenu.setContentLoaded(true)}
                  className={styles.listItemIcon}
                  src={`./icons/${props.item}Black.svg`}
                  alt={`${props.item} icon`}
               />
               : <img
                  className={styles.listItemIcon}
                  src={`./icons/${props.item}Black.svg`}
                  alt={`${props.item} icon`}
               />
         }
         {splitStringIntoWords(props.item as string, true)}
      </li>
   )
}



export default MenuItem