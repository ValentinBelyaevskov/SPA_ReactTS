import styles from './GuestPage.module.scss'
import { useAppDispatch } from '../../../hooks/redux';
import { profileActions } from '../redux/profileReducer';
import { Button } from '../../../common';

type Props = {
}

const GuestPage = (props: Props) => {
   // hooks
   const dispatch = useAppDispatch()

   // clickHandlers
   const setSignInMode: (signInMode: boolean) => void = (signInMode: boolean) => {
      dispatch(profileActions.setProfileMode("signIn"))
   }


   return (
      <div className={styles.guestModePage}>
         <div className={styles.subscription}>
            You are in guest mode. You cannot write a message to a user and add someone as a friend.
         </div>
         <div className={styles.signInButtons}>
            <Button params={
               {
                  clickListener: () => setSignInMode(true),
                  text: "Sign in",
                  type: 'button',
                  containerClassName: `${styles.login} ${styles.buttonContainer}`,
                  buttonStyle: { padding: "5px 20px" }
               }
            } />
         </div>
      </div>
   )
}

export default GuestPage