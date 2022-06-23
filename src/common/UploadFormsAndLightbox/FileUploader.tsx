import styles from "./UploadEditor.module.scss";
import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import Button from "common/Button/Button";
import { usePopupForm } from "hooks/usePopup/usePopupForm";
import { LoadInfo } from "types/types";
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";



interface Props {
   finishEditing: () => void
   submitListener: (file: File | null, callback: () => void, type: "file") => void
   loadInfo?: LoadInfo
   closeButtonClickHandler?: () => void
   uploadButtonText: string
   popupText: string
}

type Inputs = {
   fileList: { 0: File }
}

type VideoStyle = {
   width?: string
   height?: string
   left?: string
}



const FileUploader = (props: Props) => {
   const [textSrc, setTextSrc] = useState<string>("");
   const [textFile, setTextFile] = useState<File | null>(null);
   const fileLabelButtonHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const popupForm = usePopupForm(props.finishEditing);
   const fieldsRef = useRef<HTMLDivElement>(null);



   const setImageSrc = (): void => {
      const inputFile: File = watch("fileList")[0];

      if (inputFile) {
         const src: string = URL.createObjectURL(inputFile);

         setTextSrc(src);
         setTextFile(inputFile);
      } else {
         setTextFile(null);
         setTextSrc("");
      }
   }

   const closeButtonClickHandler = (e: React.MouseEvent): void => {
      popupForm.hideEditorStyle();
      popupForm.setClickedButtonName(e);
   }



   const { register, watch } = useForm<Inputs>({
      mode: "onBlur",
   });



   useEffect(() => {
      const callback = (): void => {
         popupForm.hideEditorStyle();
         URL.revokeObjectURL(textSrc);
      }

      if (textFile) {
         props.submitListener(textFile, callback, "file");
      }
   }, [textFile]);


   
   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor} ${styles.changeAvatarEditor}`}>
         <div className={`${styles.formContainer}`}>
            <form id="updloadAvatar" className={styles.form}>
               <h2 className={styles.title}>
                  {props.popupText}
               </h2>
               <div className={styles.inputFields} ref={fieldsRef}>
                  <label
                     className={`${styles.fileLabel} ${styles.addFileToPost} ${fileLabelButtonHoverAndTouchClassNames.className}`}
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
                     {...register("fileList", { onChange: setImageSrc })}
                  />
               </div>
               <div className={styles.buttons}>
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



export default FileUploader