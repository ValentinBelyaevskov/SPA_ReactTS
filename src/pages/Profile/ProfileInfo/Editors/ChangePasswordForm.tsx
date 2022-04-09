import styles from "./Editor.module.scss"
import { useForm, SubmitHandler } from "react-hook-form";
import { profileActions, getProfileInfo, update, getLoadInfo } from '../../redux/profileReducer';
import { Button } from "../../../../common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { usePopupForm } from '../../../../hooks/usePopupForm';
import { useInputVisibilitySwitch } from "hooks/useInputVisibilitySwitch";


// types
interface Props {
   finishEditing: () => void
}

type Inputs = {
   currentPassword: string
   newPassword: string
}


const ChangePasswordForm = (props: Props) => {
   // consts
   const dispatch = useAppDispatch();
   const profile = useAppSelector(getProfileInfo);
   const loadInfo = useAppSelector(getLoadInfo);
   
   
   // custom hooks
   const popupForm = usePopupForm(endEditingCallback);
   const currentPasswordVisibility = useInputVisibilitySwitch("./icons/showPasswordIcon.svg", "./icons/hidePasswordIcon.svg")
   const newPasswordVisibility = useInputVisibilitySwitch("./icons/showPasswordIcon.svg", "./icons/hidePasswordIcon.svg")


   // funcs
   function endEditingCallback(): void {
      props.finishEditing();
      if (popupForm.clickedButton && popupForm.clickedButton.includes("setNewPasswordButton")) {
         dispatch(profileActions.resetProfileInfo("signIn"))
         dispatch(profileActions.setProfileInfoMode("view"))
         localStorage.clear()
      }
   }


   // handle form
   const { register, handleSubmit, formState: { errors, isValid } } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         currentPassword: "",
         newPassword: "",
      }
   })

   const onSubmit: SubmitHandler<Inputs> = data => {
      dispatch(profileActions.setLoadInfo({
         ...loadInfo,
         loaded: false,
         loading: true,
      }))
      dispatch(update({
         profile: { ...profile, },
         profilePasswords: { ...data },
         callback: popupForm.hideEditorStyle,
      }))
   }


   // render
   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor}`}>
         <div className={`${styles.changePasswordFormContainer} ${styles.formContainer}`}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
               <h2 className={styles.title}>
                  Change password
               </h2>
               <div className={styles.inputFields}>
                  <label className={styles.label} htmlFor="currentPassword">Current password:</label>
                  <div className={styles.passwordInputContainer}>
                     <input
                        className={`${styles.input} ${styles.passwordInput}`}
                        type={currentPasswordVisibility.inputType}
                        {
                        ...register(
                           "currentPassword",
                           {
                              minLength: {
                                 value: 8,
                                 message: "Must be 8 characters or more",
                              },
                              maxLength: {
                                 value: 250,
                                 message: "Must be 250 characters or less",
                              },
                              required: "Required",
                           }
                        )
                        }
                        autoComplete="on"
                     />
                     <img
                        className={`${styles.passwordVisibilityIcon} unselectable`}
                        src={currentPasswordVisibility.icon}
                        alt="show or hide password icon"
                        onClick={currentPasswordVisibility.iconClickListener}
                     />
                     <p className={styles.validationError}>{errors.currentPassword ? errors.currentPassword.message : null}</p>
                  </div>

                  <label className={styles.label} htmlFor="newPassword">New password:</label>
                  <div className={styles.passwordInputContainer}>
                     <input
                        className={`${styles.input}  ${styles.passwordInput}`}
                        type={newPasswordVisibility.inputType}
                        {
                        ...register(
                           "newPassword",
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
                        autoComplete="on"
                     />
                     <img
                        className={`${styles.passwordVisibilityIcon} unselectable`}
                        src={newPasswordVisibility.icon}
                        alt="show or hide password icon"
                        onClick={newPasswordVisibility.iconClickListener}
                     />
                  </div>
                  <p className={styles.validationError}>{errors.newPassword ? errors.newPassword.message : null}</p>

                  {
                     loadInfo.loading ? <div className={`${styles.warning} ${styles.loadingWarning}`}>Loading...</div>
                        : loadInfo.error ? <div className={`${styles.warning} ${styles.errorWarning}`}>{`${loadInfo.error}`}</div>
                           : null
                  }
                  <div>
                     <p className={styles.description}>
                        After changing the password, you will need to log in again using the new password.
                     </p>
                  </div>
               </div>
               <div className={styles.buttons}>
                  <Button
                     params={
                        {
                           clickHandler: popupForm.setClickedButtonName,
                           text: "Set new Password",
                           type: "submit",
                           buttonClassName: `${styles.formButton} setNewPasswordButton`,
                           disabled: !isValid
                        }
                     }
                  />
                  <Button
                     params={
                        {
                           containerClassName: "closeButtonContainer",
                           clickHandler: (e) => { popupForm.hideEditorStyle(); popupForm.setClickedButtonName(e) },
                           text: "Close",
                           type: "button",
                           buttonClassName: `${styles.formButton} closeButton`
                        }
                     }
                  />
               </div>
            </form>
         </div>
      </div>
   )
}

export default ChangePasswordForm