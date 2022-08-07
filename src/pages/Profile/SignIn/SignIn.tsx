import styles from './SignIn.module.scss'
import LoginForm from './Forms/LoginForm';
import CreateAccountForm from './Forms/CreateAccountForm';
import LoginAsGuestForm from './Forms/LoginAsGuestForm';
import { useAppSelector } from '../../../hooks/redux';
import { getSignInMode } from '../redux/profileReducer';
import { useContext, useEffect } from 'react';
import { AppContext } from 'App';



const SignIn = () => {
   const signInMode = useAppSelector(getSignInMode);
   const setShowPreloader = useContext(AppContext).setShowPreloader!;



   useEffect(() => {
      setShowPreloader(false);
   }, [])



   return (
      <div className={styles.signIn}>
         {
            (signInMode === "login") || (signInMode === "passwordReset") || (signInMode === "emailConfirmation")
               ? <LoginForm />
               : signInMode === "createAccount"
                  ? <CreateAccountForm />
                  : signInMode === "loginAsGuest"
                     ? <LoginAsGuestForm />
                     : null
         }
      </div>
   )
}

export default SignIn