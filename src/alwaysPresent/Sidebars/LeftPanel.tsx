import styles from "./LeftPanel.module.scss"
import Controls from '../Controls/Controls';


export const LeftPanel = () => {
   return (
      <div className={styles.leftPanel}>
         <Controls />
      </div>
   )
}

export default LeftPanel