import { useEffect, useState } from "react";
import { PopupSwitcherIcon, PopupControlsCtxt, PopupStyle } from "types/types";


export const usePopupControlsContext = () => {
   const [icon, setIcon] = useState<PopupSwitcherIcon>("./icons/burger.svg");
   const [popupLoaded, setPopupLoaded] = useState<boolean>(false);
   const [popupStyle, setPopupStyle] = useState<PopupStyle>({ display: 'none' });
   const [needToShowPopup, setNeedToShowPopup] = useState<boolean>(false);
   const [needToShowBackground, setNeedToShowBackground] = useState<boolean>(false);




   const popupContextValue: PopupControlsCtxt = {
      popupLoaded,
      popupStyle,
      needToShowPopup,
      icon,
      setIcon,
      setNeedToShowPopup,
      needToShowBackground,
      setNeedToShowBackground,
      setPopupLoaded,
   }




   useEffect(() => {
      if (popupLoaded) {
         setPopupStyle({});
      } else {
         setPopupStyle({ display: 'none' });
      }
   }, [popupLoaded]);




   return popupContextValue
}