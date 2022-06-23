import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import { useEffect, useRef, useState } from 'react';
import styles from './TextEditor.module.scss'
import Picker from 'emoji-picker-react';
import { useElementEventHandlers } from 'hooks/useElementEventHandlers';



type Props = {
   textEditorClickListener?: (e: React.MouseEvent) => void
   containerClassName?: string
   setTextEditorInnerHTML: React.Dispatch<React.SetStateAction<string | undefined>>
}




const TextEditor = (props: Props) => {
   const emojiIconHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const textEditorRef = useRef<HTMLDivElement>(null);
   const [chosenEmoji, setChosenEmoji] = useState<any>(null);
   const [showPicker, setShowPicker] = useState<boolean>(false);
   const emojiIconEvents = useElementEventHandlers(
      ["touchmove", "touchstart", "click", "resize"],
      emojiIconEventsCallback,
      [".picker"]);




   function emojiIconEventsCallback() {
      setShowPicker(false);
   }


   const emojiIconClickListener = () => {
      emojiIconHoverAndTouchClassNames.clickListener();
      setShowPicker(!showPicker);
      emojiIconEvents.addEventListener();
   }


   const onEmojiClick = (event: React.MouseEvent, emojiObject: any) => {
      setChosenEmoji(emojiObject);
   };


   const textInputListener = (): void => {
      if (textEditorRef.current) {
         const innerHTML = textEditorRef.current.innerHTML;

         if (innerHTML) {
            props.setTextEditorInnerHTML(innerHTML);
         }

         if (innerHTML === "<br>") {
            textEditorRef.current.innerHTML = "";
         }
      }
   }




   useEffect(() => {
      return () => {
         emojiIconEvents.removeEventListener();
      }
   }, [])


   useEffect(() => {
      if (chosenEmoji && chosenEmoji.emoji && textEditorRef.current) {
         textEditorRef.current.innerHTML = textEditorRef.current.innerHTML + chosenEmoji.emoji;
      }
   }, [chosenEmoji, textEditorRef.current])




   return (
      <div className={`${styles.textEditorContainer} ${props.containerClassName ? props.containerClassName : ""}`}>
         <div
            className={styles.textEditor}
            onClick={props.textEditorClickListener}
            ref={textEditorRef}
            contentEditable={true}
            placeholder="Anything new?"
            onInput={textInputListener}
         >
         </div>
         <img
            className={`${styles.emojiIcon} picker ${emojiIconHoverAndTouchClassNames.className}`} src="./icons/emoji.svg" alt="emoji icon"
            onClick={emojiIconClickListener}
            onMouseEnter={emojiIconHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={emojiIconHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={emojiIconHoverAndTouchClassNames.touchEndListener}
         />
         {
            showPicker && (
               <div className={`${styles.emojiContainer} picker`}>
                  <div className={`${styles.pickerContainer} picker`}>
                     <Picker onEmojiClick={onEmojiClick} />
                  </div>
               </div>
            )
         }
      </div>
   );
}




export default TextEditor