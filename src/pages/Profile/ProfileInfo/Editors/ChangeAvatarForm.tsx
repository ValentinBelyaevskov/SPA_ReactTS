import styles from "./Editor.module.scss"
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import React, { useState } from "react";
import { profileActions, getLoadInfo, uploadFile, getProfileInfo } from '../../redux/profileReducer';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../../../../common";
import { useEffect } from 'react';
import { usePopupForm } from '../../../../hooks/usePopupForm';


// types
interface Props {
   finishEditing: () => void,
}

type Inputs = {
   fileList: { 0: File }
}


const ChangeAvatarForm = (props: Props) => {
   // consts
   const dispatch = useAppDispatch();
   const loadInfo = useAppSelector(getLoadInfo);
   const profileInfo = useAppSelector(getProfileInfo);
   const [imgSrc, setImgSrc] = useState<string>("")

   // custom hooks
   const popupForm = usePopupForm(props.finishEditing)


   // funcs
   const setImageSrc = (): void => {
      const inputFile: File = watch("fileList")[0];
      setImgSrc(URL.createObjectURL(inputFile));
   }


   // handle form
   const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
      mode: "onBlur",
   });

   const onSubmit: SubmitHandler<Inputs> = data => {
      console.log(profileInfo.avatar);
      dispatch(uploadFile({
         file: data.fileList[0],
         typeOfFile: "avatar",
         callback: () => {
            popupForm.hideEditorStyle();
            URL.revokeObjectURL(imgSrc);
         },
         objectId: profileInfo.objectId,
         avatar: profileInfo.avatar,
      }));
      dispatch(profileActions.setLoadInfo({
         ...loadInfo,
         loaded: false,
         loading: true,
      }));
   }


   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor}`}>
         <div className={`${styles.changeAvatarFormContainer} ${styles.formContainer}`}>
            <form id="updloadAvatar" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
               <h2 className={styles.title}>
                  Update avatar:
               </h2>
               <div className={styles.inputFields}>
                  <label className={styles.label} htmlFor="fileList">Select a file:</label>
                  <input
                     className={styles.input}
                     type="file"
                     {...register("fileList", { onChange: setImageSrc })}
                  />
                  {
                     imgSrc
                        ? (
                           <div className={styles.changeAvatarPreview}>
                              <img src={imgSrc as string}></img>
                           </div>
                        )
                        : null
                  }
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
                           clickHandler: () => { },
                           text: "Upload new avatar",
                           type: "submit",
                           buttonStyle: { padding: "5px 20px" },
                           disabled: watch("fileList")
                              ? (
                                 watch("fileList")[0]
                                    ? false
                                    : true
                              )
                              : true,
                           buttonClassName: `${styles.formButton} uploadNewAvatar`
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
                           buttonStyle: { padding: "5px 20px" },
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

export default ChangeAvatarForm