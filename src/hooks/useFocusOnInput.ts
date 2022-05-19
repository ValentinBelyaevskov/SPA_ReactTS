import { useEffect, useRef, useState } from 'react';


export const useFocusOnInput = () => {
   const inputFieldContainer = useRef<HTMLDivElement>(null);
   const [inputField, setInputField] = useState<HTMLInputElement | null>(null);



   const innerElementClickListener = (e: React.MouseEvent | React.TouchEvent): false | void => {
      if (inputField) {
         if (e.type === "mousedown") e.preventDefault();
         inputField.focus();
      }
   }



   useEffect(() => {
      if (inputFieldContainer.current) {
         setInputField(inputFieldContainer.current.firstElementChild as HTMLInputElement)
      }
   }, [inputFieldContainer.current]);



   return {
      inputFieldContainer,
      innerElementClickListener
   }
}