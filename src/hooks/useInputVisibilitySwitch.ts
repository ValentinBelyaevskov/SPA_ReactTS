import { useState, useEffect } from 'react';


export const useInputVisibilitySwitch = (showIcon: string, hideIcon: string) => {
   const [showPassword, setshowPassword] = useState<boolean>(false);
   const [icon, setIcon] = useState<string>(showIcon);
   const [inputType, setInputType] = useState<"password" | "text">("password");

   useEffect(() => {
      if (showPassword) {
         setIcon(hideIcon)
         setInputType("text")
      } else {
         setIcon(showIcon)
         setInputType("password")
      }
   }, [showPassword])

   const iconClickListener = () => {
      if (showPassword) {
         setshowPassword(false);
      } else {
         setshowPassword(true);
      }
   }

   return {
      icon,
      inputType,
      iconClickListener
   }
}