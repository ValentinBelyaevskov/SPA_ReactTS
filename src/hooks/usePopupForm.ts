import { useState, useEffect } from 'react';


type EditorStyle = { opacity: 0 | 1 }

type ClickedButton = string | undefined

type ClosingCallback = () => void

type EndEditingCallback = () => void


export const usePopupForm = (endEditingCallback: EndEditingCallback) => {
   const [editorStyle, setEditorStyle] = useState<EditorStyle>({ opacity: 1 });
   const [clickedButton, setClickedButton] = useState<ClickedButton>(undefined);


   // funcs
   const hideEditorStyle = (): void => {
      setEditorStyle({ opacity: 0 });
   }

   const transitionEndListener = (e: React.TransitionEvent): void => {
      if (e.currentTarget === e.target) {
         endEditingCallback();
         setClickedButton(undefined);
      }
   }

   const setClickedButtonName = (e: React.MouseEvent): void => {
      setClickedButton(e.currentTarget.className)
   }

   return {
      editorStyle,
      clickedButton,
      hideEditorStyle,
      transitionEndListener,
      setClickedButtonName,
   }
}