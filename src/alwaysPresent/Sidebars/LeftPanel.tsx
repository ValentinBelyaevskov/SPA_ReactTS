import Controls from "alwaysPresent/Controls/Controls"
import styles from "./LeftPanel.module.scss"
import { useState, useEffect } from 'react';


type ControlsStyle = { display?: "none" }


export const LeftPanel = () => {
   // consts, vars
   const [controlsLoaded, setControlsLoaded] = useState<boolean>(false);
   const [headerElementStyle, setHeaderElementStyle] = useState<ControlsStyle>({ display: 'none' });


   // effects
   useEffect(() => {
      if (controlsLoaded) {
         setHeaderElementStyle({})
      } else {
         setHeaderElementStyle({ display: 'none' })
      }
   }, [controlsLoaded])

   return (
      <div className={styles.leftPanel}>
         <div className={styles.ControlsContainer}  style={headerElementStyle}>
            <Controls setControlsLoaded={setControlsLoaded} />
         </div>
      </div>
   )
}

export default LeftPanel