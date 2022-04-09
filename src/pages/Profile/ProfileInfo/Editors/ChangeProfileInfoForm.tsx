import styles from "./Editor.module.scss"
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import React, { useState } from "react";
import { profileActions, getProfileInfo, getLoadInfo, update } from '../../redux/profileReducer';
import { useForm, SubmitHandler } from "react-hook-form";
import { removeExtraSpaces } from "../../../../functions";
import Backendless from 'backendless';
import { Button } from "../../../../common";


// types
type Props = {
   finishEditing: () => void,
}

type LocalState = {
   editorStyle: { opacity: number },
   clickedButton: string | undefined,
}

type EditorStyle = {
   opacity: number
}

type ClickedButton = string | undefined

interface Inputs {
   username: string,
   email: string,
   location: string,
   [key: string]: string,
}


const ChangeProfileInfoForm = (props: Props) => {
   // hooks
   const dispatch = useAppDispatch();
   const profile = useAppSelector(getProfileInfo);
   const loadInfo = useAppSelector(getLoadInfo);
   const [editorStyle, setEditorStyle] = useState<EditorStyle>({ opacity: 1 });
   const [clickedButton, setClickedButton] = useState<ClickedButton>(undefined);


   // funcs
   const hideEditorStyle = (): void => {
      // setLocalState({ ...localState, editorStyle: { opacity: 0 } })
      setEditorStyle({ opacity: 0 })
   }

   const transitionEndListener = (e: React.TransitionEvent): void => {
      if (e.currentTarget === e.target) {
         props.finishEditing()
      }
   }

   const setClickedButtonName = (e: React.MouseEvent): void => {
      if (e.currentTarget.classList.contains("closeButton") && clickedButton !== "saveButton") {
         dispatch(profileActions.setLoadInfo({
            error: undefined,
            errorType: undefined,
            loaded: false,
            loading: false,
         }))
      }
      // setLocalState({ ...localState, clickedButton: e.currentTarget.classList[0] })
      setClickedButton(e.currentTarget.classList[0])
   }

   // handle form
   const { register, handleSubmit, formState: { errors, isValid } } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         username: profile.username,
         email: profile.email,
         location: profile.location,
      }
   })

   const onSubmit: SubmitHandler<Inputs> = data => {
      dispatch(profileActions.setLoadInfo({
         ...loadInfo,
         loaded: false,
         loading: true,
      }))

      const editedData = new Backendless.User();
      for (let key in data) {
         editedData[key as keyof Backendless.User] = removeExtraSpaces(data[key])
      }

      dispatch(update({
         profile: { ...editedData, objectId: profile.objectId },
         callback: hideEditorStyle,
      }))
   }


   // render
   return (
      <div style={editorStyle} onTransitionEnd={transitionEndListener} className={`${styles.editor} editor`}>
         <div className={`${styles.changeProfileInfoFormContainer} ${styles.formContainer}`}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
               <h2 className={styles.title}>
                  Edit profile information
               </h2>
               <div className={styles.inputFields}>
                  <label className={styles.label} htmlFor="username">User name:</label>
                  <input
                     className={styles.input}
                     type="text"
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
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.username ? errors.username.message : null}</p>

                  <label className={styles.label} htmlFor="email">Email:</label>
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
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.email ? errors.email.message : null}</p>

                  <label className={styles.label} htmlFor="location">Location:</label>
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
                        }
                     )
                     }
                     autoComplete="on"
                  />
                  <p className={styles.validationError}>{errors.location ? errors.location.message : null}</p>
                  {
                     loadInfo.loading ? <div className={`${styles.warning} ${styles.loadingWarning}`}>Loading...</div>
                        : loadInfo.error ? <div className={`${styles.warning} ${styles.errorWarning}`}>{`${loadInfo.error}`}</div>
                           : null
                  }
               </div>
               <div className={styles.buttons}>
                  <Button
                     params={
                        {
                           containerClassName: "saveButtonContainer",
                           clickHandler: setClickedButtonName,
                           text: "Save",
                           type: "submit",
                           disabled: !isValid,
                           buttonClassName: `${styles.formButton} saveButton`
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

export default ChangeProfileInfoForm