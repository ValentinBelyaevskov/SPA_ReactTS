import styles from './ErrorPage.module.scss'
import { useAppDispatch } from '../../../hooks/redux';
import { profileActions } from '../redux/profileReducer';
import { Button } from '../../../common';


type Props = {
   setTrySignIn: (trySignIn: boolean) => void
}


const ErrorPage = (props: Props) => {
   const dispatch = useAppDispatch();

   const clickHandler = (): void => {
      props.setTrySignIn(true);
      dispatch(profileActions.setProfileMode('signIn'));
   }

   return (
      <div className={styles.container}>
         <p className={styles.subscription}>
            Profile data was not retrieved due to an unknown error. Try signing in again.
         </p>
         <Button
            params={
               {
                  type: "button",
                  clickHandler: clickHandler,
                  text: "Try Sign in",
                  containerStyle: {
                     margin: "10px auto 0 auto"
                  },
                  buttonStyle: {
                     padding: "5px 20px"
                  }
               }
            }
         />
      </div>
   )
}

export default ErrorPage