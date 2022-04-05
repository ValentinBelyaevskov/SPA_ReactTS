import { Header, LeftPanel, RightPanel } from './alwaysPresent'
import styles from './App.module.scss'
import { useAppDispatch } from './hooks/redux'
import { Profile } from './pages'
import { useEffect } from 'react';
import { getProfileProps, profileActions } from './pages/Profile/redux/profileReducer';


type Props = {
}


const App = (props: Props) => {
   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(profileActions.setProfileInfoMode("view"))
      dispatch(getProfileProps())
   }, [])


   return (
      <div className={styles.app}>
         <div className={styles.headerContainer}>
            <Header />
         </div>
         <div className={styles.sidebarsContainer}>
            <LeftPanel />
            <RightPanel />
            <div className={styles.pageBackground}></div>
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