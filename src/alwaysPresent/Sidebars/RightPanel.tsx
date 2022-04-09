import Recommendations from "alwaysPresent/Recommendations/Recommendations"
import styles from "./RightPanel.module.scss"


export const RightPanel = () => {
   return (
      <div className={styles.rightPanel}>
         <Recommendations />
      </div>
   )
}

export default RightPanel