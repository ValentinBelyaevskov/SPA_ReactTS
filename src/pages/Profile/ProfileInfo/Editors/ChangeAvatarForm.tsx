import styles from "./Editor.module.scss"
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import React, { useState } from "react";
import { profileActions, getLoadInfo, uploadFile, getProfileInfo } from '../../redux/profileReducer';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../../../../common";


// types
interface Props {
   finishEditing: () => void,
}

interface LocalState {
   editorStyle: { opacity: number }
   clickedButton: string | undefined
   imgSrc: string
}

type Inputs = {
   fileList: {0: File}
}


const ChangeAvatarForm = (props: Props) => {
   // hooks
   const loadInfo = useAppSelector(getLoadInfo);
   const profileInfo = useAppSelector(getProfileInfo);
   const dispatch = useAppDispatch();
   const [localState, setLocalState] = useState<LocalState>({
      editorStyle: { opacity: 1 },
      clickedButton: undefined,
      imgSrc: "",
   });


   // funcs
   const hideEditorStyle = (): void => {
      setLocalState({ ...localState, editorStyle: { opacity: 0 } });
   }

   const transitionEndListener = (e: React.TransitionEvent): void => {
      if (e.currentTarget === e.target) {
         props.finishEditing();
      }
   }

   const setClickedButtonName = (e: React.MouseEvent): void => {
      localState.clickedButton = e.currentTarget.classList[e.currentTarget.classList.length - 1]
      if (e.currentTarget.classList.contains("closeButton")) {
         dispatch(profileActions.setLoadInfo({
            error: undefined,
            errorType: undefined,
            loaded: false,
            loading: false,
         }));
      }
   }

   const setImgSrc = (): void => {
      const inputFile: File = watch("fileList")[0];
      setLocalState({ ...localState, imgSrc: URL.createObjectURL(inputFile) });
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
            hideEditorStyle();
            URL.revokeObjectURL(localState.imgSrc);
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
      <div style={localState.editorStyle} onTransitionEnd={transitionEndListener} className={`${styles.editor}`}>
         <form id="updloadAvatar" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.title}>
               Update avatar:
            </h2>
            <div className={styles.inputFields}>
               <label className={styles.label} htmlFor="fileList">Select a file:</label>
               <input
                  className={styles.input}
                  type="file"
                  {...register("fileList", { onChange: setImgSrc })}
               />
               {
                  localState.imgSrc
                     ? (
                        <div className={styles.changeAvatarPreview}>
                           <img src={localState.imgSrc as string}></img>
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
                           : true
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

export default ChangeAvatarForm