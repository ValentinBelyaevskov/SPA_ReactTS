import { audioPlayerApi } from "common/AudioPlayer/API/audioPlayerAPI";
import { audioPlayerActions, getPlayerAudioFileIds, getPlayerAudioFiles, getPlayerState } from "common/AudioPlayer/redux/audioPlayerReducer";
import { AudioFile } from "common/AudioPlayer/types/types";
import { AudioPlayerContext } from "common/AudioPlayer/useAudioPlayer";
import { getArrayWithUpdatedItemValue } from "functions/getArrayWithUpdatedItemValue";
import { getFilledArray } from "functions/getFiledArray";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { WindowSize } from "hooks/useWindowSize";
import { useContext, useEffect, useState } from "react";
import { AppCtxt } from "types/types";




export const useAudioBlock = (appContext: AppCtxt, resize: WindowSize) => {
   const dispatch = useAppDispatch();

   const {
      showPlayerOnPlayBtnClick,
      setShowPlayerOnPlayBtnClick
   } = useContext(AudioPlayerContext);

   const audioPlayerState = useAppSelector(getPlayerState("general"));
   const audioPlayerStateAPI = new audioPlayerApi(dispatch, audioPlayerActions, "general");
   const audios = useAppSelector(getPlayerAudioFiles("general"));
   const audioIds = useAppSelector(getPlayerAudioFileIds("general"));
   const [audiosBlockStyle, setAudiosBlockStyle] = useState<{ marginTop?: string }>({});
   const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);
   const [audioFiles, setAudioFiles] = useState<File[]>([]);

   const [audioLoadingStatuses, setAudioLoadingStatuses] = useState<boolean[]>(getFilledArray(false, audioIds.length));
   const [numberOfAudioLoadedStatuses, setNumberOfAudioLoadedStatuses] = useState<number>(0);




   const addAudio = (file: File | null, callback: () => void, type: "audio"): void => {
      if (file) {
         const audioObj: AudioFile = {
            src: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type,
         }

         audioPlayerStateAPI.addAudioFile(audioObj);
         setAudioFiles([...audioFiles, file]);
      }

      callback();
   }


   const deleteAudio = (id: number): void => {
      const idNumber = audioIds.findIndex(audioId => id === audioId);

      setAudioFiles(audioFiles.filter((item, index) => index !== idNumber));

      if (id === audioPlayerState.activeTrackId) {
         if (audioIds.length === 1) {
            audioPlayerStateAPI.setActiveTrackId(0);
         } else if (idNumber === audioIds.length - 1) {
            audioPlayerStateAPI.setActiveTrackId(audioIds[idNumber - 1]);
         } else {
            audioPlayerStateAPI.setActiveTrackId(audioIds[idNumber + 1]);
         }
      }

      audioPlayerStateAPI.removeAudioFile(id);
   }


   const updateLoadingStatusesItem = (index: number, newItemValue: boolean): void => {
      setAudioLoadingStatuses(getArrayWithUpdatedItemValue<boolean>(audioLoadingStatuses, index, newItemValue));
   }


   const resetAudios = (): void => {
      setAudioFiles([]);
      setShowAudioPlayer(false);
      audioPlayerStateAPI.resetPlayer();
   }




   useEffect(() => {
      if (resize.value[0] <= 950 && showAudioPlayer) {
         appContext.setShowAudioPlayer!(true);

      } else {
         appContext.setShowAudioPlayer!(false);
      }
   }, [showAudioPlayer, resize.value[0]])


   useEffect(() => {
      setAudioLoadingStatuses(getFilledArray(false, audioIds.length));

      if (audioIds.length === 0) {
         audioPlayerStateAPI.resetPlayer();
         setAudioLoadingStatuses(getFilledArray(false, audioIds.length));
         setShowPlayerOnPlayBtnClick!(false);
      }
   }, [audioIds.length])


   useEffect(() => {
      setNumberOfAudioLoadedStatuses(audioLoadingStatuses.filter(item => item === true).length);
   }, [audioLoadingStatuses])


   useEffect(() => {
      if (audioIds.length > 0) {
         setAudiosBlockStyle({ marginTop: "15px" });
      } else {
         setAudiosBlockStyle({});
         setShowAudioPlayer(false);
         audioPlayerStateAPI.setIsPlaying(false);
      }
   }, [audioIds.length])


   useEffect(() => {
      if (audioPlayerState.isPlaying && !showAudioPlayer && audioIds.length > 0) {
         setShowAudioPlayer(true);
      } else if (audioIds.length === 0) {
         setShowAudioPlayer(false);
      }
   }, [audioPlayerState.isPlaying, showAudioPlayer, audioIds.length])


   useEffect(() => {
      if (!audioPlayerState.showAudioPlayer) {
         setShowAudioPlayer(false);
      } else {
         setShowPlayerOnPlayBtnClick!(true)
      }
   }, [audioPlayerState.showAudioPlayer])


   useEffect(() => {
      if (showAudioPlayer && showPlayerOnPlayBtnClick) audioPlayerStateAPI.setShowAudioPlayer(true);
   }, [showAudioPlayer, showPlayerOnPlayBtnClick])


   useEffect(() => {
      if (showAudioPlayer) {
         const width = resize.value[0];

         audioPlayerStateAPI.setConfig({
            adaptToWindowSize: true,
            activeTrackId: 0,
            isPlaying: false,
            showAudioPlayer: true,
            mode: "thumbnail",
            full: {
               needBoxShadow: true,
               playerShouldBeSmallWidth: false,
               maxSizeForSmallWidthPlayer: 360,
               style: width > 950
                  ? {
                     position: "absolute",
                     top: "46px",
                     width: "510px",
                     left: "-157px",
                  }
                  : width > 550
                     ? {
                        position: "absolute",
                        bottom: "40px",
                        width: "510px",
                        left: "-74px",
                     }
                     : width > 460
                        ? {
                           position: "absolute",
                           bottom: "40px",
                           width: "100%",
                           left: "0",
                        }
                        : {
                           position: "absolute",
                           bottom: "46px",
                           width: "100%",
                           left: "0",
                        }
            },
            thumbnail: {
               needBoxShadow: false,
               showFullPlayer: true,
               style: {
                  padding: width > 950
                     ? "0.6rem 1rem 1rem 1rem"
                     : "0.5rem 1rem 0.5rem 1rem"
               }
            },
            playerWindowWidth: width > 950 ? 950 : 750,
            trackNameAdaptability: [
               [550, undefined, 425, 35],
               [461, 549, 312, 26],
               [400, 460, 244, 27],
               [321, 400, 164, 11],
               [280, 320, 124, 8],
            ],
            trackNamesBreakPoint: 950,
            mobileBreakPoint: 460
         })

         audioPlayerStateAPI.setStatus(true);
      }
   }, [showAudioPlayer, resize.value[0]])




   return {
      audioIds,
      audios,
      audioFiles,
      audiosBlockStyle,
      audioPlayerState,
      audioPlayerStateAPI,
      audioLoadingStatuses,
      numberOfAudioLoadedStatuses,
      showAudioPlayer,
      setShowAudioPlayer,
      showPlayerOnPlayBtnClick,
      setShowPlayerOnPlayBtnClick,
      setAudioLoadingStatuses,
      setAudiosBlockStyle,
      setNumberOfAudioLoadedStatuses,
      updateLoadingStatusesItem,
      addAudio,
      deleteAudio,
      resetAudios
   }
}