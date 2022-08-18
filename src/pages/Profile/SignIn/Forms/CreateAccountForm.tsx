import styles from './Forms.module.scss'
import SignInButton from '../SignInButton/SignInButton';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { createAccount, profileActions, getObjectId, getLoadInfo, getProfileMode } from '../../redux/profileReducer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useFocusOnInput } from 'hooks/useFocusOnInput';
import { useInputVisibilitySwitch } from 'hooks/useInputVisibilitySwitch';
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';



type Inputs = {
   firstName: string,
   lastName: string,
   location: string,
   email: string,
   password: string,
   rememberMe: boolean,
}



const CreateAccountForm = () => {
   const objectId = useAppSelector(getObjectId);
   const loadInfo = useAppSelector(getLoadInfo);
   const progfileMode = useAppSelector(getProfileMode);
   const dispatch = useAppDispatch();
   const passwordVisibility = useInputVisibilitySwitch("./icons/hidePasswordIcon.svg", "./icons/showPasswordIcon.svg");
   const passwordInputFocus = useFocusOnInput();
   const passwordIconPseudoClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);



   const passwordIconTouchStartListener = (e: React.TouchEvent): void => {
      passwordIconPseudoClassNames.touchStartListener();
      passwordInputFocus.innerElementClickListener(e);
   }

   const passwordIconClickListener = () => {
      passwordIconPseudoClassNames.clickListener()
      passwordVisibility.iconClickListener()
   }

   const { register, handleSubmit, clearErrors, formState: { errors, isValid } } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         firstName: "",
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
            firstName: data.firstName,
            lastName: data.lastName,
            location: data.location,
            email: data.email,
            password: data.password,
         },
      }))
      dispatch(profileActions.setSignInMode('emailConfirmation'))
      dispatch(profileActions.setLoadInfo({
         ...loadInfo,
         loading: true,
         loaded: false,
      }))
   }



   return (
      <div className={`${styles.signIn} pagePart`}>
         <form className={`${styles.form} ${styles.createAccount}`} onSubmit={handleSubmit(onSubmit)}>
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
                     type="text"
                     {
                     ...register(
                        "firstName",
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
                     placeholder={"First name"}
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.firstName ? errors.firstName.message : null}</p>
               </div>


               <div className={styles.inputContainer} >
                  <input
                     className={styles.input}
                     type="text"
                     {
                     ...register(
                        "lastName",
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
                     placeholder={"Last name"}
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.lastName ? errors.lastName.message : null}</p>
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


               <div className={styles.inputContainer} ref={passwordInputFocus.inputFieldContainer}>
                  <input
                     className={styles.input}
                     type={passwordVisibility.inputType}
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
                  <img
                     className={`${styles.passwordVisibilityIcon} ${passwordIconPseudoClassNames.className} unselectable`}
                     src={passwordVisibility.icon}
                     alt="show or hide password icon"
                     onClick={passwordIconClickListener}
                     onMouseDown={passwordInputFocus.innerElementClickListener}
                     onMouseEnter={passwordIconPseudoClassNames.mouseEnterListener}
                     onTouchStart={passwordIconTouchStartListener}
                     onTouchEnd={passwordIconPseudoClassNames.touchEndListener}
                  />
                  <p className={styles.validationError}>{errors.password ? errors.password.message : null}</p>
               </div>


               <div className={styles.rememberMeAndLoginFlex}>
                  <SignInButton
                     type="submit"
                     name="register"
                     clickListener={() => { }}
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
                     clickListener={() => {
                        dispatch(profileActions.setSignInMode("login"))
                        clearErrors();
                        dispatch(profileActions.setErrors({ error: undefined, errorType: undefined }))
                     }}
                  />
                  <SignInButton
                     type="button"
                     name="loginAsGuestMode"
                     clickListener={() => {
                        if (progfileMode === "guestSignIn") {
                           dispatch(profileActions.setProfileMode("loggedInAsGuest"));
                        } else {
                           dispatch(profileActions.setSignInMode("loginAsGuest"));
                           clearErrors();
                        }
                        dispatch(profileActions.setErrors({ error: undefined, errorType: undefined }))
                     }}
                  />
               </div>
            </div>
         </form>
      </div>
   )
}

export default CreateAccountForm