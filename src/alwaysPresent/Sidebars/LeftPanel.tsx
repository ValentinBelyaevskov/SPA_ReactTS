import Controls from "alwaysPresent/Controls/Controls"
import styles from "./LeftPanel.module.scss"
import { useContext } from 'react';
import { ControlsContext } from "App";


export const LeftPanel = () => {
   const context = useContext(ControlsContext);

   return (
      <div className={styles.leftPanel}>
         <div className={styles.ControlsContainer}  style={context.controlsStyle}>
            <Controls />
         </div>
      </div>
   )
}

export default LeftPanel