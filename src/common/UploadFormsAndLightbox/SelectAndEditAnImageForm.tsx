import styles from "./UploadEditor.module.scss";
import { useState, useEffect, SyntheticEvent } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-image-crop/src/ReactCrop.scss';
import Button from "common/Button/Button";
import { usePopupForm } from "hooks/usePopup/usePopupForm";
import { useGetCroppedImage } from "./useGetCroppedImage";
import { LoadInfo } from "types/types";
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";




interface Props {
   finishEditing: () => void
   submitListener: (croppedImage: File | null, callback: () => void, type: "image", croppedImageSizes?: [number, number]) => void
   imageAspect: number | undefined
   loadInfo?: LoadInfo
   closeButtonClickHandler?: () => void
   uploadUncroppedImage: boolean
   uploadButtonText: string
   popupText: string
}


type Inputs = {
   fileList: File[]
}




const SelectAndEditAnImageForm = (props: Props) => {
   const [imgSrc, setImgSrc] = useState<string>("");
   const [image, setImage] = useState<HTMLImageElement | null>(null);
   const [imageFile, setImageFile] = useState<File | null>(null);
   const [editorWithPreviewClassName, setEditorWithPreviewClassName] = useState<string | undefined>(undefined);
   const fileLabelButtonHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const [errorString, setErrorString] = useState<"The file must be an image" | undefined>(undefined);
   const popupForm = usePopupForm(props.finishEditing);
   const {
      aspect,
      crop,
      setCrop,
      croppedImage,
      croppedImgSrc,
      completedCrop,
      setCompletedCrop,
      getCroppedImage,
      croppedImageSizes,
      setCroppedImageSizes
   } = useGetCroppedImage(props.imageAspect);




   const setImageSrcOnChange = (): void => {
      const inputFile: File = watch("fileList")[0];

      if (inputFile && !isTheFileAnImage(inputFile)) {
         setErrorString('The file must be an image');
         return
      };

      if (inputFile) {
         setImgSrc(URL.createObjectURL(inputFile));
         setImageFile(inputFile);
      } else {
         setImageFile(null);
         setImgSrc("");
      }
   }

   const imgLoadListener = (e: SyntheticEvent<HTMLImageElement>) => {
      setImage(e.currentTarget);
      setEditorWithPreviewClassName(styles.editorWithPreviewClassName);
   }

   const closeButtonClickHandler = (e: React.MouseEvent): void => {
      popupForm.hideEditorStyle();
      popupForm.setClickedButtonName(e);
   }

   const isTheFileAnImage = (imageFile: File) => imageFile.type.slice(0, 5) === "image" ? true : false;




   const { register, handleSubmit, watch } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         fileList: undefined,
      }
   })

   const onSubmit: SubmitHandler<Inputs> = () => {
      if (imageFile && !isTheFileAnImage(imageFile)) return;

      const callback = (): void => {
         popupForm.hideEditorStyle();
         URL.revokeObjectURL(imgSrc);
         URL.revokeObjectURL(croppedImgSrc);
      }

      if (croppedImage) {
         props.submitListener(croppedImage, callback, "image", croppedImageSizes);
      } else if (imageFile && props.uploadUncroppedImage) {
         props.submitListener(imageFile, callback, "image", croppedImageSizes);
      }
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


   useEffect(() => {
      if (imageFile && !isTheFileAnImage(imageFile)) {
         setErrorString('The file must be an image');
      } else {
         setErrorString(undefined);
      }
   }, [imageFile])


   useEffect(() => {
      if (imgSrc && !completedCrop) {
         const img: HTMLImageElement = document.createElement("img");
         img.src = imgSrc;
         img.onload = () => {
            setCroppedImageSizes([img.width, img.height]);
         }
      }
   }, [imgSrc, completedCrop])




   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor} ${styles.changeAvatarEditor} ${editorWithPreviewClassName}`}>
         <div className={`${styles.SelectAndEditAnImageFormContainer} ${styles.formContainer}`}>
            <form id="updloadAvatar" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
               <h2 className={styles.title}>
                  {props.popupText}
               </h2>
               <div className={styles.inputFields}>
                  <label
                     className={`${styles.fileLabel} ${fileLabelButtonHoverAndTouchClassNames.className}`}
                     htmlFor="file"
                     onClick={fileLabelButtonHoverAndTouchClassNames.clickListener}
                     onMouseEnter={fileLabelButtonHoverAndTouchClassNames.mouseEnterListener}
                     onTouchStart={fileLabelButtonHoverAndTouchClassNames.touchStartListener}
                     onTouchEnd={fileLabelButtonHoverAndTouchClassNames.touchEndListener}
                  >
                     Select a file
                  </label>
                  <input
                     className={styles.input}
                     type="file"
                     id="file"
                     accept="image/*"
                     {...register("fileList", { onChange: setImageSrcOnChange })}
                  />
                  <p className={styles.validationError}>{errorString ? errorString : null}</p>
                  {
                     imgSrc && (
                        <ReactCrop
                           className={styles.changeAvatarPreview}
                           aspect={aspect}
                           crop={crop}
                           onComplete={(c) => setCompletedCrop(c)}
                           onChange={c => setCrop(c)}
                        >
                           <img className="unselectable" src={imgSrc} onLoad={imgLoadListener}></img>
                        </ReactCrop>
                     )
                  }
                  {
                     props.loadInfo
                        ? (props.loadInfo.loading ? <div className={`${styles.warning} ${styles.loadingWarning}`}>Loading...</div>
                           : props.loadInfo.error ? <div className={`${styles.warning} ${styles.errorWarning}`}>{`${props.loadInfo.error}`}</div>
                              : null)
                        : null
                  }
                  {

                  }
               </div>
               <div className={styles.buttons}>
                  <Button
                     params={
                        {
                           containerClassName: `${styles.formButtonContainer}`,
                           clickHandler: () => { },
                           text: props.uploadButtonText,
                           disabled:
                              (
                                 croppedImage
                                 && completedCrop
                                 && completedCrop.width
                                 && completedCrop.height
                              )
                                 || (
                                    imageFile && props.uploadUncroppedImage && isTheFileAnImage(imageFile)
                                 )
                                 ? false
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




export default SelectAndEditAnImageForm