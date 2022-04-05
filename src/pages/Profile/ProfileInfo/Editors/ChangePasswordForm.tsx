import styles from "./Editor.module.scss"
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { profileActions, getProfileInfo, update, getLoadInfo } from '../../redux/profileReducer';
import { useEffect } from 'react';
import { Button } from "../../../../common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";


// types
interface Props {
   finishEditing: () => void
}

interface LocalState {
   editorStyle: { opacity: number },
   clickedButton: string | undefined
   changePassword: boolean
}

type Inputs = {
   currentPassword: string
   newPassword: string
}


const ChangePasswordForm = (props: Props) => {
   // hooks
   const profile = useAppSelector(getProfileInfo)

   const loadInfo = useAppSelector(getLoadInfo)

   const dispatch = useAppDispatch()

   const [localState, setLocalState] = useState<LocalState>({
      editorStyle: { opacity: 1 },
      clickedButton: undefined,
      changePassword: false,
   })

   useEffect(() => {
      if (localState.clickedButton === "closeButton") {
         dispatch(profileActions.setLoadInfo({
            error: undefined,
            errorType: undefined,
            loaded: false,
            loading: false,
         }))
      }
   }, [localState.clickedButton])


   // funcs
   // Срабатывает после успешного выполнения update (thunk)
   const hideEditorStyle = (): void => {
      setLocalState({ ...localState, editorStyle: { opacity: 0 } })
   }

   // Cрабатывает после окончания анимации (форма становится полностью прозрачной)
   const transitionEndListener = (e: React.TransitionEvent): void => {
      if (e.currentTarget === e.target) {
         props.finishEditing()
         if (localState.clickedButton === "setNewPasswordButton") {
            dispatch(profileActions.resetProfileInfo("signIn"))
            dispatch(profileActions.setProfileInfoMode("view"))
            localStorage.clear()
         }
      }
   }

   // При нажатии на кнопку, сохраняет её название
   const setClickedButtonName = (e: React.MouseEvent): void => {
      localState.clickedButton = e.currentTarget.classList[e.currentTarget.classList.length - 2]
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
         callback: hideEditorStyle,
      }))
   }


   // render
   return (
      <div style={localState.editorStyle} onTransitionEnd={transitionEndListener} className={`${styles.editor}`}>
         <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.title}>
               Change password
            </h2>
            <div className={styles.inputFields}>
               <label className={styles.label} htmlFor="currentPassword">Current password:</label>
               <input
                  className={styles.input}
                  type="password"
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
               <p className={styles.validationError}>{errors.currentPassword ? errors.currentPassword.message : null}</p>

               <label className={styles.label} htmlFor="newPassword">New password:</label>
               <input
                  className={styles.input}
                  type="password"
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
                        clickHandler: setClickedButtonName,
                        text: "Set new Password",
                        type: "submit",
                        buttonStyle: { padding: "5px 20px" },
                        buttonClassName: "setNewPasswordButton",
                        disabled: !isValid
                     }
                  }
               />
               <Button
                  params={
                     {
                        containerClassName: "closeButtonContainer",
                        clickHandler: (e) => { hideEditorStyle(); setClickedButtonName(e) },
                        text: "Close",
                        type: "button",
                        buttonStyle: { padding: "5px 20px" },
                        buttonClassName: "closeButton"
                     }
                  }
               />
            </div>
         </form>
      </div>
   )
}

export default ChangePasswordForm