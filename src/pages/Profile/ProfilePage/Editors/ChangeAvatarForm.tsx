import styles from "./Editor.module.scss";
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useState, useEffect, SyntheticEvent } from 'react';
import { profileActions, getLoadInfo, uploadFile, getProfileInfo } from '../../redux/profileReducer';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../../../../common";
import { usePopupForm } from '../../../../hooks/usePopup/usePopupForm';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-image-crop/src/ReactCrop.scss';
import { useGetCroppedImage } from "./hooks/useGetCroppedImage";



interface Props {
   finishEditing: () => void,
}

type Inputs = {
   fileList: { 0: File }
}



const ChangeAvatarForm = (props: Props) => {
   const dispatch = useAppDispatch();
   const loadInfo = useAppSelector(getLoadInfo);
   const profileInfo = useAppSelector(getProfileInfo);
   const [imgSrc, setImgSrc] = useState<string>("");
   const [editorWithPreviewClassName, setEditorWithPreviewClassName] = useState<string | undefined>(undefined);
   const popupForm = usePopupForm(props.finishEditing);
   const [image, setImage] = useState<HTMLImageElement | null>(null)
   const {
      aspect,
      crop,
      setCrop,
      croppedImage,
      croppedImgSrc,
      completedCrop,
      setCompletedCrop,
      getCroppedImage
   } = useGetCroppedImage();



   const setImageSrc = (): void => {
      const inputFile: File = watch("fileList")[0];
      setImgSrc(URL.createObjectURL(inputFile));
   }

   const imgLoadListener = (e: SyntheticEvent<HTMLImageElement>) => {
      setImage(e.currentTarget);
      setEditorWithPreviewClassName(styles.editorWithPreviewClassName);
   }

   const closeButtonClickHandler = (e: React.MouseEvent): void => {
      popupForm.hideEditorStyle();
      popupForm.setClickedButtonName(e);
   }



   const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
      mode: "onBlur",
   });

   const onSubmit: SubmitHandler<Inputs> = data => {
      dispatch(uploadFile({
         file: croppedImage!,
         typeOfFile: "avatar",
         callback: () => {
            popupForm.hideEditorStyle();
            URL.revokeObjectURL(imgSrc);
            URL.revokeObjectURL(croppedImgSrc);
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



   useEffect(() => {
      if (image && completedCrop) {
         const logCroppedImage = async () => {
            await getCroppedImage(image, completedCrop);
         }

         logCroppedImage()
            .catch((err) => console.log(err));
      }
   }, [completedCrop, image])



   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor} ${styles.changeAvatarEditor} ${editorWithPreviewClassName}`}>
         <div className={`${styles.changeAvatarFormContainer} ${styles.formContainer}`}>
            <form id="updloadAvatar" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
               <h2 className={styles.title}>
                  Update avatar:
               </h2>
               <div className={styles.inputFields}>
                  <label className={styles.fileLabel} htmlFor="file">Select a file:</label>
                  <input
                     className={styles.input}
                     type="file"
                     id="file"
                     {...register("fileList", { onChange: setImageSrc })}
                  />
                  {
                     imgSrc && (
                        <ReactCrop
                           className={styles.changeAvatarPreview}
                           aspect={aspect}
                           crop={crop}
                           onComplete={(c) => setCompletedCrop(c)}
                           onChange={c => setCrop(c)}
                        >
                           <img src={imgSrc} onLoad={imgLoadListener}></img>
                        </ReactCrop>
                     )
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
                           containerClassName: `${styles.formButtonContainer}`,
                           clickHandler: () => { },
                           text: "Upload new avatar",
                           disabled: watch("fileList")
                              ? (
                                 watch("fileList")[0]
                                    ? false
                                    : true
                              )
                              : true,
                           buttonClassName: `${styles.formButton} uploadNewAvatar`,
                           changeStyleOnHover: true
                        }
                     }
                  />
                  <Button
                     params={
                        {
                           containerClassName: `closeButtonContainer ${styles.formButtonContainer}`,
                           clickHandler: closeButtonClickHandler,
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
      </div>
   )
}

export default ChangeAvatarForm