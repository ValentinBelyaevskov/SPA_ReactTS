import styles from './Header.module.scss'
import Controls from '../Controls/Controls';
import SearchForm from './SearchForm';
import { useState } from 'react';


type Props = {
}


const Header = (props: Props) => {
   const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);

   // const []


   return (
      <div className={styles.header}>
         <div className={styles.controls}>
            <Controls />
         </div>
         <div className={styles.headerOptions}>
            <SearchForm />
         </div>
      </div>
   )
}

export default Header