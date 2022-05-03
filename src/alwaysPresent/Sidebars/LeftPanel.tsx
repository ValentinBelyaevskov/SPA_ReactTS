import Controls from "alwaysPresent/Controls/Controls"
import styles from "./LeftPanel.module.scss"
import { useContext } from 'react';
import { PopupControlsContext } from "App";


export const LeftPanel = () => {
   const popupControlsContext = useContext(PopupControlsContext);

   return (
      <div className={styles.leftPanel}>
         <div className={styles.ControlsContainer}  style={popupControlsContext.popupStyle}>
            <Controls />
         </div>
      </div>
   )
}

export default LeftPanel