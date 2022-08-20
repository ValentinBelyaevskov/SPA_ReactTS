import { Popup } from "hooks"
import { useElementTouchStartListener } from "hooks/usePopup/useElementTouchStartListener"
import { AddContentButtonNames } from "./ContentPanel"
import styles from './ContentPanel.module.scss'



type Props = {
   icon: string
   addContentButtonName: string
   addContentButtonClickListener: () => void
   setActiveContentIcon: React.Dispatch<React.SetStateAction<AddContentButtonNames | undefined>>
   popupPrompt: Popup
}



const AddContentIcon = (props: Props) => {
   const {
      elementTouchStartListener,
      elementHoverAndTouchClassName,
      elementClickListener,
      elementTouchEndListener,
      showElement,
      hideElement
   } = useElementTouchStartListener(styles.touch, styles.hover, ".postContentIconPrompt", props.popupPrompt, [0, 0]);



   const mouseEnterListener = (): void => {
      showElement();
      props.setActiveContentIcon(props.addContentButtonName as AddContentButtonNames)
   }

   const touchStartListener = (): void => {
      elementTouchStartListener();
      props.setActiveContentIcon(props.addContentButtonName as AddContentButtonNames)
   }

   const clickListener = (): void => {
      elementClickListener();
      props.addContentButtonClickListener();
   }



   return (
      <img
         className={`${elementHoverAndTouchClassName} unselectable`}
         src={props.icon}
         alt={`Add ${props.addContentButtonName} to post button`}
         onClick={clickListener}
         onMouseEnter={mouseEnterListener}
         onMouseLeave={hideElement}
         onTouchStart={touchStartListener}
         onTouchEnd={() => elementTouchEndListener()}
      />
   )
}



export default AddContentIcon