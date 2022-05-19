import styles from "./UploadEditor.module.scss";
import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "common/Button/Button";
import { usePopupForm } from "hooks/usePopup/usePopupForm";
import { LoadInfo } from "types/types";
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";
import { useWindowSize } from '../../hooks/useWindowSize';



interface Props {
   finishEditing: () => void
   submitListener: (file: File | null, callback: () => void, type: "image" | "video", sizes: [number, number] | undefined) => void
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



const VideoUploader = (props: Props) => {
   const [videoSrc, setVideoSrc] = useState<string>("");
   const [videoFile, setVideoFile] = useState<File | null>(null);
   const [videoSizes, setVideoSizes] = useState<[number, number]>([0, 0]);
   const fileLabelButtonHoverAndTouchClassNames = useHoverAndTouchClassNames();
   const popupForm = usePopupForm(props.finishEditing);
   const fieldsRef = useRef<HTMLDivElement>(null);
   const [videoStyle, setVideoStyle] = useState<VideoStyle>({});
   const resize = useWindowSize("resize");



   const setImageSrc = (): void => {
      const inputFile: File = watch("fileList")[0];

      if (inputFile) {
         const src: string = URL.createObjectURL(inputFile);

         setVideoSrc(src);
         setVideoFile(inputFile);
         setVideoStyle({});
      } else {
         setVideoFile(null);
         setVideoSrc("");
      }
   }

   const closeButtonClickHandler = (e: React.MouseEvent): void => {
      popupForm.hideEditorStyle();
      popupForm.setClickedButtonName(e);
   }



   const { register, handleSubmit, watch } = useForm<Inputs>({
      mode: "onBlur",
   });

   const onSubmit: SubmitHandler<Inputs> = () => {
      resize.removeEventListener()
      const callback = (): void => {
         popupForm.hideEditorStyle();
         URL.revokeObjectURL(videoSrc);
      }

      if (videoFile) {
         props.submitListener(videoFile, callback, "video", videoSizes);
      }
   }



   useEffect(() => {
      resize.addEventListener();
   }, [])


   useEffect(() => {
      const video: HTMLVideoElement = document.createElement('video');

      video.addEventListener('loadeddata', function (e) {
         setVideoSizes([this.videoWidth, this.videoHeight]);
      });

      video.src = videoSrc;
   }, [videoSrc])


   useEffect(() => {
      if (fieldsRef.current && (!videoStyle.height || videoStyle.height === "0px")) {
         let videoWidth: number = videoSizes[0];
         let videoHeight: number = videoSizes[1];
         let videoAspect = videoHeight / videoWidth;
         let containerSizes = fieldsRef.current.getBoundingClientRect();
         let containerWidth = resize.value[0] > 460 ? containerSizes.width - 36 : containerSizes.width - 30;

         if (videoWidth > containerWidth) {
            setVideoStyle({
               height: `${containerWidth * videoAspect}px`,
               width: `${containerWidth}px`,
            })
         } else {
            setVideoStyle({
               height: `${videoHeight}px`,
               width: `${videoWidth}px`,
               left: `${(containerWidth - videoWidth) / 2}px`
            })
         }
      }
   }, [videoStyle.height, fieldsRef.current, videoSizes[0], videoSizes[1], resize.value[0]])



   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor} ${styles.changeAvatarEditor}`}>
         <div className={`${styles.SelectAndEditAnImageFormContainer} ${styles.formContainer}`}>
            <form id="updloadAvatar" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
               <h2 className={styles.title}>
                  {props.popupText}
               </h2>
               <div className={styles.inputFields} ref={fieldsRef}>
                  <label
                     className={`${styles.fileLabel} ${fileLabelButtonHoverAndTouchClassNames.className}`}
                     htmlFor="file"
                     onMouseEnter={() => fileLabelButtonHoverAndTouchClassNames.setHoverClassName(styles.hover)}
                     onMouseLeave={() => fileLabelButtonHoverAndTouchClassNames.setHoverClassName("")}
                     onTouchStart={() => fileLabelButtonHoverAndTouchClassNames.setTouchClassName(styles.touch)}
                     onTouchEnd={() => fileLabelButtonHoverAndTouchClassNames.resetTouchClassName(true)}
                  >
                     Select a file
                  </label>
                  <input
                     className={styles.input}
                     type="file"
                     id="file"
                     {...register("fileList", { onChange: setImageSrc })}
                  />
                  {
                     videoSrc && (
                        <div className={styles.videoContainer} style={videoStyle}>
                           <video
                              src={videoSrc}
                              className={`${styles.video} unselectable`}
                              width={videoStyle.width}
                              height={videoStyle.height}
                              controls
                           >
                           </video>
                        </div>
                     )
                  }
                  {
                     props.loadInfo
                        ? (props.loadInfo.loading ? <div className={`${styles.warning} ${styles.loadingWarning}`}>Loading...</div>
                           : props.loadInfo.error ? <div className={`${styles.warning} ${styles.errorWarning}`}>{`${props.loadInfo.error}`}</div>
                              : null)
                        : null
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
                              videoFile
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



export default VideoUploader