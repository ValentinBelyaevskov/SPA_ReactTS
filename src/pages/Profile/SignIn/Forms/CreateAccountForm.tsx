import styles from './Forms.module.scss'
import SignInButton from '../SignInButton/SignInButton';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { createAccount, profileActions, getObjectId, getLoadInfo, getProfileMode } from '../../redux/profileReducer';
import { SubmitHandler, useForm } from 'react-hook-form';


type Inputs = {
   username: string,
   location: string,
   email: string,
   password: string,
   rememberMe: boolean,
}


const CreateAccountForm = () => {
   // hooks
   const objectId = useAppSelector(getObjectId)
   const loadInfo = useAppSelector(getLoadInfo)
   const progfileMode = useAppSelector(getProfileMode)
   const dispatch = useAppDispatch()


   // handle form
   const { register, handleSubmit, clearErrors, formState: { errors, isValid } } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         username: "",
         location: "",
         email: "",
         password: "",
         rememberMe: false,
      }
   })

   const onSubmit: SubmitHandler<Inputs> = data => {
      dispatch(createAccount({
         objectId: objectId,
         profileProps: {
            username: data.username,
            location: data.location,
            email: data.email,
            password: data.password,
         },
      }))
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
               Create account
            </h3>

            {
               loadInfo.error && (loadInfo.errorType === "createAccount")
                  ? <p className={styles.error}>{loadInfo.error}</p>
                  : null
            }

            <div className={styles.inputFields}>
               <div className={styles.inputContainer} >
                  <input
                     className={styles.input}
                     type="tex"
                     {
                     ...register(
                        "username",
                        {
                           maxLength: {
                              value: 40,
                              message: "Must be 40 characters or less"
                           },
                           minLength: {
                              value: 4,
                              message: "Must be 4 characters or more"
                           },
                           required: "Required",
                        }
                     )
                     }
                     placeholder={"User name"}
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.username ? errors.username.message : null}</p>
               </div>

               <div className={styles.inputContainer} >
                  <input
                     className={styles.input}
                     type="text"
                     {
                     ...register(
                        "location",
                        {
                           maxLength: {
                              value: 250,
                              message: "Must be 250 characters or less"
                           },
                           required: "Required",
                        }
                     )
                     }
                     placeholder={"Residence"}
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.location ? errors.location.message : null}</p>
               </div>

               <div className={styles.inputContainer} >
                  <input
                     className={styles.input}
                     type="text"
                     {
                     ...register(
                        "email",
                        {
                           maxLength: {
                              value: 250,
                              message: "Must be 250 characters or less"
                           },
                           required: "Required",
                        }
                     )
                     }
                     placeholder={"Email"}
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.email ? errors.email.message : null}</p>
               </div>

               <div className={styles.inputContainer} >
                  <input
                     className={styles.input}
                     type="password"
                     {
                     ...register(
                        "password",
                        {
                           minLength: {
                              value: 8,
                              message: "Must be 8 characters or more"
                           },
                           maxLength: {
                              value: 250,
                              message: "Must be 250 characters or less"
                           },
                           required: "Required",
                        }
                     )
                     }
                     placeholder={"Password"}
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.password ? errors.password.message : null}</p>
               </div>

               <div className={styles.rememberMeAndLoginFlex}>
                  <SignInButton
                     type="submit"
                     name="register"
                     clickHandler={() => { }}
                  />
               </div>
            </div>
            <div className={styles.createAccount}>
               <p className={styles.createAccountSubtitle}>
                  If you already have an account, login, or sign in as a guest if you don't want to register:
               </p>
               <div className={styles.createAccountButtons}>
                  <SignInButton
                     type="button"
                     name="login"
                     clickHandler={() => {
                        dispatch(profileActions.setSignInMode("login"))
                        clearErrors();
                        profileActions.setErrors({ error: undefined, errorType: undefined })
                     }}
                  />
                  <SignInButton
                     type="button"
                     name="loginAsGuestMode"
                     clickHandler={() => {
                        if (progfileMode === "guestSignIn") {
                           dispatch(profileActions.setProfileMode("loggedInAsGuest"));
                        } else {
                           dispatch(profileActions.setSignInMode("loginAsGuest"));
                           clearErrors();
                        }
                        profileActions.setErrors({ error: undefined, errorType: undefined })
                     }}
                  />
               </div>
            </div>
         </form>
      </div>
   )
}

export default CreateAccountForm