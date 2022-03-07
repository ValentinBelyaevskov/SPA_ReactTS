import styles from './Header.module.scss'
import Controls from '../Controls/Controls';


type Props = {
}


const Header = (props: Props) => {
   return (
      <div className={styles.header}>
         <div className={styles.controls}>
            <Controls />
         </div>
         <div className={styles.headerOptions}>
            Header search
         </div>
      </div>
   )
}

export default Header