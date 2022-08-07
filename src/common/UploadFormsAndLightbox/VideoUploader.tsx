import styles from "./UploadEditor.module.scss";
import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "common/Button/Button";
import { usePopupForm } from "hooks/usePopup/usePopupForm";
import { LoadInfo } from "types/types";
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";
import { useWindowSize } from '../../hooks/useWindowSize';
import { convertFileSizeToMb } from "functions/convertFileSizeToMB";



interface Props {
   finishEditing: () => void
   submitListener: (file: File | null, callback: () => void, type: "image" | "video", sizes: [number, number] | undefined) => void
   loadInfo?: LoadInfo
   closeButtonClickHandler?: () => void
   uploadButtonText: string
   popupText: string
   playVideoListener?: () => void
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
   const fileLabelButtonHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const popupForm = usePopupForm(props.finishEditing);
   const fieldsRef = useRef<HTMLDivElement>(null);
   const [videoStyle, setVideoStyle] = useState<VideoStyle>({});
   const resize = useWindowSize("resize");
   const [errorString, setErrorString] = useState<string | undefined>(undefined);



   const setVideoSrcOnChange = (): void => {
      const inputFile: File = watch("fileList")[0];

      if (inputFile) {
         if (!isTheFileAnVideo(inputFile)) {
            setErrorString('The file must be an video');
            setVideoFile(null);
            setVideoSrc("")
            return;
         } else if (!fileSizeDoesNotExceedTheAllowable(inputFile)) {
            setErrorString('file size should not exceed 20 mb');
            setVideoFile(null);
            setVideoSrc("")
            return;
         } else {
            setErrorString(undefined)
         }
      }

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

   const isTheFileAnVideo = (imageFile: File) => imageFile.type.slice(0, 5) === "video" ? true : false;

   const fileSizeDoesNotExceedTheAllowable = (file: File) => convertFileSizeToMb(file.size) <= 20 ? true : false


   const { register, handleSubmit, watch } = useForm<Inputs>({
      mode: "onBlur",
   });

   const onSubmit: SubmitHandler<Inputs> = () => {
      if (
         videoFile
         && !isTheFileAnVideo(videoFile)
         && !fileSizeDoesNotExceedTheAllowable(videoFile)
      ) return;

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
            });
         } else {
            setVideoStyle({
               height: `${videoHeight}px`,
               width: `${videoWidth}px`,
               left: `${(containerWidth - videoWidth) / 2}px`
            });
         }
      }
   }, [videoStyle.height, fieldsRef.current, videoSizes[0], videoSizes[1], resize.value[0]])

   useEffect(() => {
      if (videoFile) {
         if (!isTheFileAnVideo(videoFile)) {
            setErrorString('The file must be an video');
         } else if (!fileSizeDoesNotExceedTheAllowable(videoFile)) {
            setErrorString('The file must be an video');
         }

      } else if (
         (
            videoFile
            && isTheFileAnVideo(videoFile)
            && fileSizeDoesNotExceedTheAllowable(videoFile)
         )
      ) {
         setErrorString(undefined);
      }
   }, [videoFile])



   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor} ${styles.changeAvatarEditor}`}>
         <div className={`${styles.formContainer}`}>
            <form id="updloadAvatar" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
               <h2 className={styles.title}>
                  {props.popupText}
               </h2>
               <div className={styles.inputFields} ref={fieldsRef}>
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
                     accept="video/mp4,video/x-m4v,video/*"
                     {...register("fileList", { onChange: setVideoSrcOnChange })}
                  />
                  <p className={styles.validationError}>{errorString ? errorString : null}</p>
                  {
                     videoSrc && (
                        <div className={styles.videoContainer} style={videoStyle}>
                           <video
                              src={videoSrc}
                              className={`${styles.video} unselectable`}
                              width={videoStyle.width}
                              height={videoStyle.height}
                              onPlay={props.playVideoListener}
                              muted={true}
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
                              videoFile && isTheFileAnVideo(videoFile)
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