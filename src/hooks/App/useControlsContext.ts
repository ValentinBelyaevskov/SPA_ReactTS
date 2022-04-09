import { useEffect, useState } from "react";
import { BurgerIcon, ControlsCtxt, ControlsStyle } from "types/types";


export const useControlsContext = () => {
   // consts
   const [icon, setIcon] = useState<BurgerIcon>("./icons/burger.svg");
   const [controlsLoaded, setControlsLoaded] = useState<boolean>(false);
   const [controlsStyle, setControlsStyle] = useState<ControlsStyle>({ display: 'none' });
   const [needToShowControls, setNeedToShowControls] = useState<boolean>(false);


   // functions
   const burgerIconClickListener = (needToShowControls: boolean): void => {
      if (needToShowControls) {
         setNeedToShowControls(false);
      } else {
         setNeedToShowControls(true);
      }
   }


   // return constants
   const controlsContextValue: ControlsCtxt = {
      icon,
      setIcon,
      controlsLoaded,
      controlsStyle,
      needToShowControls,
      setNeedToShowControls,
      setControlsLoaded,
      burgerIconClickListener,
   }


   // effects
   useEffect(() => {
      if (controlsLoaded) {
         setControlsStyle({});
      } else {
         setControlsStyle({ display: 'none' });
      }
   }, [controlsLoaded]);


   return {
      needToShowControls,
      controlsContextValue,
      controlsStyle
   }
}