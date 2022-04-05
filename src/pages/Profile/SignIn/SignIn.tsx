import styles from './SignIn.module.scss'
import LoginForm from './Forms/LoginForm';
import CreateAccountForm from './Forms/CreateAccountForm';
import LoginAsGuestForm from './Forms/LoginAsGuestForm';
import { useAppSelector } from '../../../hooks/redux';
import { getSignInMode } from '../redux/profileReducer';



const SignIn = () => {
   // hooks

   const signInMode = useAppSelector(getSignInMode)

   return (
      <div className={styles.signIn}>
         {
            (signInMode === "login") || (signInMode === "passwordReset")
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