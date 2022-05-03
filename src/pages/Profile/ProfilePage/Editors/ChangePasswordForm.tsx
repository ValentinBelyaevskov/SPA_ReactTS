import styles from "./Editor.module.scss"
import { useForm, SubmitHandler } from "react-hook-form";
import { profileActions, getProfileInfo, update, getLoadInfo } from '../../redux/profileReducer';
import { Button } from "../../../../common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { usePopupForm } from '../../../../hooks/usePopup/usePopupForm';
import { useInputVisibilitySwitch } from "hooks/useInputVisibilitySwitch";
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";
import { useFocusOnInput } from '../../../../hooks/useFocusOnInput';
import { IconsThatAreLoaded } from "common/IconsThatAreLoaded/IconsThatAreLoaded";
import { useState } from "react";



interface Props {
   finishEditing: () => void
}

type Inputs = {
   currentPassword: string
   newPassword: string
}



const ChangePasswordForm = (props: Props) => {
   const dispatch = useAppDispatch();
   const [editIconsLoaded, setEditIconsLoaded] = useState<boolean>(false);
   const profile = useAppSelector(getProfileInfo);
   const loadInfo = useAppSelector(getLoadInfo);
   const popupForm = usePopupForm(endEditingCallback);
   const currentPasswordVisibility = useInputVisibilitySwitch("./icons/hidePasswordIcon.svg", "./icons/showPasswordIcon.svg");
   const newPasswordVisibility = useInputVisibilitySwitch("./icons/hidePasswordIcon.svg", "./icons/showPasswordIcon.svg");
   const currentPasswordIconPseudoClassNames = useHoverAndTouchClassNames();
   const newPasswordIconPseudoClassNames = useHoverAndTouchClassNames();
   const firstInputFocus = useFocusOnInput();
   const secondInputFocus = useFocusOnInput();
   const icons: string[] = [
      "./icons/showPasswordIcon.svg",
      "./icons/hidePasswordIcon.svg",
   ]



   function endEditingCallback(): void {
      props.finishEditing();
      if (popupForm.clickedButton && popupForm.clickedButton.includes("setNewPasswordButton")) {
         dispatch(profileActions.resetProfileInfo("signIn"));
         dispatch(profileActions.setProfileInfoMode("view"));
         localStorage.clear();
      }
   }

   const { register, handleSubmit, formState: { errors, isValid } } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         currentPassword: "",
         newPassword: "",
      }
   });

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

   const currentPasswordIconTouchStartListener = (e: React.TouchEvent): void => {
      currentPasswordIconPseudoClassNames.setTouchClassName(styles.touch);
      firstInputFocus.innerElementClickListener(e);
   }

   const newPasswordIconTouchStartListener = (e: React.TouchEvent): void => {
      newPasswordIconPseudoClassNames.setTouchClassName(styles.touch);
      secondInputFocus.innerElementClickListener(e);
   }



   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor} ${styles.changePasswordEditor}`}>
         {editIconsLoaded ?
            <div className={`${styles.changePasswordFormContainer} ${styles.formContainer}`}>
               <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                  <h2 className={styles.title}>
                     Change password
                  </h2>
                  <div className={styles.inputFields}>
                     <label className={styles.label} htmlFor="currentPassword">Current password:</label>
                     <div className={styles.passwordInputContainer} ref={firstInputFocus.inputFieldContainer}>
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
                           className={`${styles.passwordVisibilityIcon} ${currentPasswordIconPseudoClassNames.className} unselectable`}
                           src={currentPasswordVisibility.icon}
                           alt="show or hide password icon"
                           onClick={currentPasswordVisibility.iconClickListener}
                           onMouseDown={firstInputFocus.innerElementClickListener}
                           onMouseEnter={() => currentPasswordIconPseudoClassNames.setHoverClassName(styles.hover)}
                           onMouseLeave={() => currentPasswordIconPseudoClassNames.setHoverClassName("")}
                           onTouchStart={currentPasswordIconTouchStartListener}
                           onTouchEnd={() => currentPasswordIconPseudoClassNames.resetTouchClassName(true)}
                        />
                        <p className={styles.validationError}>{errors.currentPassword ? errors.currentPassword.message : null}</p>
                     </div>

                     <label className={styles.label} htmlFor="newPassword">New password:</label>
                     <div className={styles.passwordInputContainer} ref={secondInputFocus.inputFieldContainer}>
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
                           className={`${styles.passwordVisibilityIcon} ${newPasswordIconPseudoClassNames.className} unselectable`}
                           src={newPasswordVisibility.icon}
                           alt="show or hide password icon"
                           onClick={newPasswordVisibility.iconClickListener}
                           onMouseDown={secondInputFocus.innerElementClickListener}
                           onMouseEnter={() => newPasswordIconPseudoClassNames.setHoverClassName(styles.hover)}
                           onMouseLeave={() => newPasswordIconPseudoClassNames.setHoverClassName("")}
                           onTouchStart={newPasswordIconTouchStartListener}
                           onTouchEnd={() => newPasswordIconPseudoClassNames.resetTouchClassName(true)}
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
                              containerClassName: `${styles.formButtonContainer}`,
                              clickHandler: popupForm.setClickedButtonName,
                              text: "Set new Password",
                              type: "submit",
                              buttonClassName: `${styles.formButton} setNewPasswordButton`,
                              disabled: !isValid,
                              changeStyleOnHover: true
                           }
                        }
                     />
                     <Button
                        params={
                           {
                              containerClassName: `closeButtonContainer ${styles.formButtonContainer}`,
                              clickHandler: (e) => { popupForm.hideEditorStyle(); popupForm.setClickedButtonName(e) },
                              text: "Close",
                              type: "button",
                              buttonClassName: `${styles.formButton} closeButton`,
                              changeStyleOnHover: true
                           }
                        }
                     />
                  </div>
               </form>
            </div>
            : null
         }
         <IconsThatAreLoaded setIconsLoaded={setEditIconsLoaded} icons={icons} />
      </div>
   )
}

export default ChangePasswordForm