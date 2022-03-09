import { Header, LeftPanel, RightPanel } from './alwaysPresent'
import styles from './App.module.scss'
import { Profile } from './pages'


type Props = {
}


const App = (props: Props) => {
   return (
      <div className={styles.app}>
         <div className={styles.headerContainer}>
            <Header />
         </div>
         <div className={styles.sidebarsContainer}>
            <LeftPanel />
            <RightPanel />
         </div>
         <div className={styles.pagesContainer}>
            {/* <div className={styles.page}>
            </div> */}
            <Profile />
         </div>
      </div>
   )
}

export default App