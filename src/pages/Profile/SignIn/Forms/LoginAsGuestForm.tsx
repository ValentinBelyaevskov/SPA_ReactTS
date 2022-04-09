import styles from './Forms.module.scss'
import SignInButton from '../SignInButton/SignInButton';
import { loginAsGuest, profileActions, getLoadInfo } from '../../redux/profileReducer';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { SubmitHandler, useForm } from 'react-hook-form';


type Inputs = {
   rememberMe: boolean,
}


const LoginAsGuestForm = () => {
   // hooks
   const dispatch = useAppDispatch()
   const loadInfo = useAppSelector(getLoadInfo)


   // handle form
   const { register, handleSubmit, clearErrors } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         rememberMe: false,
      }
   })

   const onSubmit: SubmitHandler<Inputs> = data => {
      dispatch(loginAsGuest(data.rememberMe))
         dispatch(profileActions.setLoadInfo({
            ...loadInfo,
            loading: true,
            loaded: false,
         }))
   }



   return (
      <div className={`${styles.signIn} pagePart`}>
         <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h3 className={styles.title} >
               Login as guest
            </h3>
            {
               loadInfo.error && (loadInfo.errorType === "loginAsGuest")
                  ? <p className={styles.error}>{loadInfo.error}</p>
                  : null
            }
            <div className={styles.inputFields}>
               <div className={styles.rememberMeAndLoginFlex}>
                  <div className={styles.inputContainer} >
                  <input
                        className={`${styles.checkbox}`}
                        type="checkbox"
                        id="rememberMe"
                        {...register("rememberMe")}
                     />
                     <label htmlFor="rememberMe" className={`${styles.checkboxLabel} unselectable`}>remember me</label>
                  </div>
                  <SignInButton
                     type="submit"
                     name={"loginAsGuestMode"}
                     clickHandler={() => { }}
                  />
               </div>
            </div>
            <div className={styles.createAccount}>
               <p className={styles.createAccountSubtitle}>
                  If you already have an account, sign in or create an account if you don't have one:
               </p>
               <div className={styles.createAccountButtons}>
                  <SignInButton
                     type="button"
                     name="createAccountBtn"
                     clickHandler={() => {
                        dispatch(profileActions.setSignInMode("createAccount"))
                        clearErrors();
                        profileActions.setErrors({ error: undefined, errorType: undefined })
                     }}
                  />
                  <SignInButton
                     type="button"
                     name="login"
                     clickHandler={() => {
                        dispatch(profileActions.setSignInMode("login"))
                        clearErrors();
                        profileActions.setErrors({ error: undefined, errorType: undefined })
                     }}
                  />
               </div>
            </div>
         </form>
      </div>
   )
}

export default LoginAsGuestForm