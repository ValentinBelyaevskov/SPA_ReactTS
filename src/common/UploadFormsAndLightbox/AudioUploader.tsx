import styles from "./UploadEditor.module.scss";
import { useState, useRef, useEffect, useContext } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "common/Button/Button";
import { usePopupForm } from "hooks/usePopup/usePopupForm";
import { LoadInfo } from "types/types";
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";
import React from 'react';
import PlayerInterface from "common/AudioPlayer/PlayerInterface";
import { audioPlayerApi } from "common/AudioPlayer/API/audioPlayerAPI";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { audioPlayerActions, getPlayerStatus } from "common/AudioPlayer/redux/audioPlayerReducer";
import { getPlayerState, getShowAudioPlayer } from '../AudioPlayer/redux/audioPlayerReducer';



interface Props {
   finishShowingThePopup: () => void
   submitListener: (file: File | null, callback: () => void, type: "audio") => void
   loadInfo?: LoadInfo
   closeButtonClickHandler?: () => void
   uploadButtonText: string
   popupText: string
   setOtherAudioIsPlaying?: () => void
   volumeValue?: number
   setVolumeValue?: React.Dispatch<React.SetStateAction<number>>
}

type Inputs = {
   fileList: { 0: File }
}




const AudioUploader = (props: Props) => {
   const [audioSrc, setAudioSrc] = useState<string>("");
   const [audioFile, setAudioFile] = useState<File | null>(null);
   const fileLabelButtonHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const [editingCompleted, setEditingCompleted] = useState<boolean>(false);
   const popupForm = usePopupForm(() => {
      props.finishShowingThePopup();
      setEditingCompleted(true);
      if (showAudioPlayer) playerStateAPI.resetPlayer();
   });
   const fieldsRef = useRef<HTMLDivElement>(null);
   const [errorString, setErrorString] = useState<"The file must be an video" | undefined>(undefined);


   // * audioPlayer
   const [showPlayerInterface, setShowPlayerInterface] = useState<boolean>(false);
   const dispatch = useAppDispatch();
   const playerStateAPI = new audioPlayerApi(dispatch, audioPlayerActions, "popup");
   const playerStatus = useAppSelector(getPlayerStatus("popup"));
   const showAudioPlayer = useAppSelector(getShowAudioPlayer("popup"))
   const playerState = useAppSelector(getPlayerState("popup"));
   const [needToExecuteACallback, setNeedToExecuteACallback] = useState<boolean>(true);
   // *


   const setImageSrc = (): void => {
      const inputFile: File = watch("fileList")[0];

      if (inputFile) {
         const src: string = URL.createObjectURL(inputFile);

         setAudioSrc(src);
         setAudioFile(inputFile);
      } else {
         setAudioFile(null);
         setAudioSrc("");
      }
   }


   const closeButtonClickHandler = (e: React.MouseEvent): void => {
      popupForm.hideEditorStyle();
      popupForm.setClickedButtonName(e);
   }


   const isTheFileAnAudio = (imageFile: File) => imageFile.type.slice(0, 5) === "audio" ? true : false;


   const { register, watch, handleSubmit } = useForm<Inputs>({
      mode: "onBlur",
   });


   const onSubmit: SubmitHandler<Inputs> = () => {
      if (audioFile && !isTheFileAnAudio(audioFile)) return;

      const callback = (): void => {
         popupForm.hideEditorStyle();
         URL.revokeObjectURL(audioSrc);
      }

      if (audioFile) {
         props.submitListener(audioFile, callback, "audio");
      }
   }


   const onInputChange = (): void => {
      setShowPlayerInterface(false);
      setImageSrc();
   }




   useEffect(() => {
      if (
         audioFile
         && audioSrc
         && !errorString
         && playerStatus
         && showAudioPlayer
      ) {
         setTimeout(() => {
            setShowPlayerInterface(true)
         }, 100);
      }
   }, [
      audioFile
      , audioSrc
      , !errorString
      , playerStatus
      , showAudioPlayer
   ])


   useEffect(() => {
      if (audioFile && !isTheFileAnAudio(audioFile)) {
         setErrorString('The file must be an video');
      } else {
         setErrorString(undefined);
      }
   }, [audioFile])


   useEffect(() => {
      if (audioFile && audioSrc && !editingCompleted) {
         playerStateAPI.setConfig({
            adaptToWindowSize: true,
            activeTrackId: 0,
            isPlaying: false,
            showAudioPlayer: true,
            mode: "full",
            full: {
               needBoxShadow: true,
               style: {
                  margin: "15px 0 5px 0"
               },
               maxSizeForSmallWidthPlayer: 360
            },
            playerWindowWidth: 950,
            trackNameAdaptability: [
               [525, undefined, 425, 35],
            ],
            animatedOpacity: true
         })

         playerStateAPI.setStatus(true);

      } else if (!showAudioPlayer) {
         playerStateAPI.resetPlayer();
      }
   }, [audioFile, audioSrc, showAudioPlayer, editingCompleted, playerState.showAudioPlayer])


   useEffect(() => {
      if (audioFile && audioSrc) {
         playerStateAPI.setAudioFiles([
            {
               src: audioSrc,
               name: audioFile.name,
               size: audioFile.size,
               type: "audio",
            }
         ]);
      }
   }, [audioFile, audioSrc])


   useEffect(() => {
      if (playerState.isPlaying && needToExecuteACallback && props.setOtherAudioIsPlaying) {
         props.setOtherAudioIsPlaying();
         setNeedToExecuteACallback(false);
      }
   }, [playerState.isPlaying, needToExecuteACallback])




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
                     accept="audio/*"
                     {...register("fileList", { onChange: onInputChange })}
                  />
                  <p className={styles.validationError}>{errorString ? errorString : null}</p>
                  {
                     props.loadInfo
                        ? (props.loadInfo.loading ? <div className={`${styles.warning} ${styles.loadingWarning}`}>Loading...</div>
                           : props.loadInfo.error ? <div className={`${styles.warning} ${styles.errorWarning}`}>{`${props.loadInfo.error}`}</div>
                              : null)
                        : null
                  }
                  {
                     showPlayerInterface
                        ? (
                           <div className={styles.preloaderContainer}>
                              <PlayerInterface name="popup" />
                           </div>
                        )
                        : audioFile
                        && audioSrc
                        && (
                           <div className={styles.preloaderContainer}>
                              <img className={styles.preloader} src="./animatedIcons/preloader2.svg" alt='preloader' />
                           </div>
                        )
                  }
               </div>
               <div className={styles.buttons}>
                  <Button
                     params={
                        {
                           containerClassName: `${styles.formButtonContainer}`,
                           clickListener: () => { },
                           text: props.uploadButtonText,
                           disabled:
                              audioFile && isTheFileAnAudio(audioFile)
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
                           clickListener: closeButtonClickHandler,
                           text: "Close",
                           type: "button",
                           buttonClassName: `${styles.formButton} closeButton`,
                           changeStyleOnHover: true
                        }
                     }
                  />
               </div>
               <img style={{ display: "none" }} src="./animatedIcons/preloader2.svg" alt='preloader' />
            </form>
         </div>
      </div>
   )
}



export default AudioUploader