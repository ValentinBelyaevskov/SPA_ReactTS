import styles from './Forms.module.scss'
import SignInButton from '../SignInButton/SignInButton';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { login, profileActions, getLoadInfo, getProfileMode, passwordReset, getSignInMode } from '../../redux/profileReducer';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useInputVisibilitySwitch } from '../../../../hooks/useInputVisibilitySwitch';
import { useFocusOnInput } from '../../../../hooks/useFocusOnInput';
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';



type ClickedButton = undefined | "login" | "resetPassword";

type ResetPasswordWasClicked = boolean;

type Inputs = {
   email: string,
   password: string,
   rememberMe: boolean,
}



const LoginForm = () => {
   const loadInfo = useAppSelector(getLoadInfo);
   const profileMode = useAppSelector(getProfileMode);
   const signInMode = useAppSelector(getSignInMode);
   const dispatch = useAppDispatch();
   const [clickedButton, setClickedButton] = useState<ClickedButton>(undefined);
   const [resetPasswordWasClicked, setResetPasswordWasClicked] = useState<ResetPasswordWasClicked>(false);
   const passwordVisibility = useInputVisibilitySwitch("./icons/hidePasswordIcon.svg", "./icons/showPasswordIcon.svg");
   const passwordInputFocus = useFocusOnInput();
   const passwordIconPseudoClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const rememberMePseudoClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);



   const passwordIconTouchStartListener = (e: React.TouchEvent): void => {
      passwordIconPseudoClassNames.touchStartListener();
      passwordInputFocus.innerElementClickListener(e);
   }

   const passwordIconClickListener = () => {
      passwordIconPseudoClassNames.clickListener();
      passwordVisibility.iconClickListener();
   }

   const { register, handleSubmit, clearErrors, formState: { errors, isValid } } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         email: "",
         password: "",
         rememberMe: false,
      }
   });

   const onSubmit: SubmitHandler<Inputs> = data => {
      if (clickedButton === "login") {
         dispatch(login({
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe,
         }))
         if (signInMode === 'passwordReset') {
            dispatch(profileActions.setSignInMode('login'))
         }
      } else if (clickedButton === 'resetPassword') {
         dispatch(passwordReset({
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe,
         }));
         dispatch(profileActions.setSignInMode('passwordReset'));
      }
      dispatch(profileActions.setLoadInfo({
         ...loadInfo,
         loading: true,
         loaded: false,
      }));
   }



   useEffect(() => {
      setResetPasswordWasClicked(false);
   }, []);



   return (
      <div className={`${styles.signIn} pagePart`}>
         <form className={`${styles.form}  ${styles.login}`} onSubmit={handleSubmit(onSubmit)}>
            <h3 className={styles.title} >
               Login
            </h3>
            {
               (loadInfo.error && (loadInfo.errorType === "emailConfirmation"))
                  ? <p className={styles.prompt}>Before you login and begin working with the application, please confirm your email address by following the link.
                     <br />The link is in the message sent to your email.</p>
                  : null
            }
            {
               (signInMode === 'passwordReset')
                  ? <p className={styles.prompt}>An email has been sent to your email address with a link to the password change page.
                     <br />After successfully changing your password, return to the app and log in to your account with the new password.
                     <br /><span className={styles.redPrompt}>Entrance is possible after the blocking time (15 minutes)</span>
                  </p>
                  : null
            }
            {
               loadInfo.error && (loadInfo.errorType === "login")
                  ? <p className={styles.error}>{loadInfo.error}</p>
                  : loadInfo.error && (loadInfo.errorType === "manyFailedLoginAttempts")
                     ? <p className={styles.error}>Too many failed login attempts. Re-entry will be possible after 15 minutes.</p>
                     : null
            }
            <div className={styles.inputFields}>
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
                     className={`${styles.input} ${styles.passwordInput}`}
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
               <SignInButton
                  type="submit"
                  name="resetPassword"
                  clickHandler={() => {
                     setClickedButton('resetPassword');
                     setResetPasswordWasClicked(true);
                  }}
               />
               {
                  (loadInfo.error && (loadInfo.errorType === "manyFailedLoginAttempts")) || resetPasswordWasClicked
                     ? (
                        <div className={styles.resetPasswordInfo}>
                           <p className={styles.prompt}>Forgot your password? In order to change your password, you need:
                              <br />1. Enter your email and current password in the input fields.
                              <br />2. Instead of «Login», click «Reset Password».</p>
                        </div>
                     )
                     : null
               }
               <div className={styles.rememberMeAndLoginFlex}>
                  <div className={styles.inputContainer} >
                     <input
                        className={`${styles.checkbox}`}
                        type="checkbox"
                        id="rememberMe"
                        {...register("rememberMe")}
                     />
                     <label
                        htmlFor="rememberMe"
                        className={`${styles.checkboxLabel} ${rememberMePseudoClassNames.className} unselectable`}
                        onClick={rememberMePseudoClassNames.clickListener}
                        onMouseEnter={rememberMePseudoClassNames.mouseEnterListener}
                        onTouchStart={rememberMePseudoClassNames.touchStartListener}
                        onTouchEnd={rememberMePseudoClassNames.touchEndListener}
                     >
                        remember me
                     </label>
                     <img className={styles.rememberMeIcon} src='./image/checked.svg' alt="remember me icon" />
                  </div>
                  <SignInButton
                     type="submit"
                     name={"login"}
                     clickHandler={() => {
                        setClickedButton('login')
                     }}
                  />
               </div>
            </div>
            <div className={styles.createAccount}>
               <p className={styles.createAccountSubtitle}>
                  Create an account if you don't have one, or login as a guest:
               </p>
               <div className={styles.loginButtons}>
                  <SignInButton
                     type="button"
                     name="createAccountBtn"
                     clickHandler={() => {
                        dispatch(profileActions.setSignInMode("createAccount"))
                        clearErrors();
                        profileActions.setErrors({ error: undefined, errorType: undefined })
                     }}
                     isValid={isValid}
                  />
                  <SignInButton
                     type="button"
                     name="loginAsGuestMode"
                     clickHandler={() => {
                        if (profileMode === "guestSignIn") {
                           dispatch(profileActions.setProfileMode("loggedInAsGuest"))
                        } else {
                           dispatch(profileActions.setSignInMode("loginAsGuest"))
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



export default LoginForm