import { splitStringIntoWords } from 'functions'
import { Popup } from 'hooks'
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames'
import styles from './MenuItem.module.scss'



type EditMode = "edit" | "changePassword" | "signOut" | "changeAvatar" | false

type Props = {
   index: number
   arrayLength: number
   item: "edit" | "changePassword" | "signOut"
   setEditMode: (editMode: EditMode) => void
   hideMenuOnTouchStart: () => void
   popupMenu: Popup
}



const MenuItem = (props: Props) => {
   const itemHoverAndTouchClassNames = useHoverAndTouchClassNames();



   const itemTouchStartListener = () => {
      itemHoverAndTouchClassNames.setTouchClassName(styles.touch);
   }

   const itemTouchEndListener = (item: "edit" | "changePassword" | "signOut"): void => {
      props.setEditMode(item);
      props.hideMenuOnTouchStart();
      itemHoverAndTouchClassNames.resetTouchClassName(true);
   }

   const itemMouseEnterListener = () => {
      itemHoverAndTouchClassNames.setHoverClassName(styles.hover);
   }

   const itemMouseLeaveListener = () => {
      itemHoverAndTouchClassNames.setHoverClassName("");
   }

   const itemClickListener = () => {
      props.hideMenuOnTouchStart()
      props.setEditMode(props.item)
   }



   return (
      <li
         className={`${styles.listItem} ${itemHoverAndTouchClassNames.className} unselectable`}
         key={props.item}
         onClick={itemClickListener}
         onMouseMove={itemMouseEnterListener}
         onMouseLeave={itemMouseLeaveListener}
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