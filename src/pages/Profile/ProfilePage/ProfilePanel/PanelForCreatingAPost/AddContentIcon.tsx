import { Popup } from "hooks"
import { useElementTouchStartListener } from "hooks/usePopup/useElementTouchStartListener"
import { AddContentButtonNames } from "./PanelForCreatingAPost"
import styles from './PanelForCreatingAPost.module.scss'



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
      resetElementTouchClassName,
      showElement,
      hideElement
   } = useElementTouchStartListener(styles.touch, styles.hover, ".prostContentIconPrompt", props.popupPrompt, [0, 0]);



   const mouseEnterListener = (): void => {
      showElement();
      props.setActiveContentIcon(props.addContentButtonName as AddContentButtonNames)
   }

   const touchStartListener = (): void => {
      elementTouchStartListener();
      props.setActiveContentIcon(props.addContentButtonName as AddContentButtonNames)
   }



   return (<img
      className={`${elementHoverAndTouchClassName} unselectable`}
      src={props.icon}
      alt={`Add ${props.addContentButtonName} to post button`}
      onClick={props.addContentButtonClickListener}
      onMouseEnter={mouseEnterListener}
      onMouseLeave={hideElement}
      onTouchStart={touchStartListener}
      onTouchEnd={() => resetElementTouchClassName(true)}
   />)
}



export default AddContentIcon