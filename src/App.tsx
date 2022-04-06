import styles from './App.module.scss'
import { useEffect } from 'react';
import { Header, LeftPanel, RightPanel } from 'alwaysPresent';
import { Profile } from 'pages';
import { getProfileProps, profileActions } from 'pages/Profile/redux/profileReducer';
import { useAppDispatch } from 'hooks/redux';


type Props = {
}


const App = (props: Props) => {
   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(profileActions.setProfileInfoMode("view"));
      dispatch(getProfileProps());
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