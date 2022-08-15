import { audioPlayerApi } from "common/AudioPlayer/API/audioPlayerAPI";
import { audioPlayerActions, getGeneralPlayerContext, getPlayerAudioFileIds, getPlayerAudioFiles, getPlayerState } from "common/AudioPlayer/redux/audioPlayerReducer";
import { AudioFile } from "common/AudioPlayer/types/types";
import { AudioPlayerContext } from "common/AudioPlayer/useAudioPlayer";
import { getArrayWithUpdatedItemValue } from "functions/getArrayWithUpdatedItemValue";
import { getFilledArray } from "functions/getFiledArray";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { WindowSize } from "hooks/useScrollOrWindowSize";
import { Post } from "pages/Profile/types/types";
import { useContext, useEffect, useState } from "react";
import { AppCtxt } from "types/types";




export type AudioFilesItem = {
   type: "audio"
   id?: number
   file?: File
   src: string
   name: string
   size: number
}




export const useAudiosBlock = (appContext: AppCtxt, resize: WindowSize, panelAudioPlayerContext: string, mode: "view" | "edit", post: Post | undefined) => {
   const dispatch = useAppDispatch();

   const {
      showPlayerOnPlayBtnClick,
      setShowPlayerOnPlayBtnClick
   } = useContext(AudioPlayerContext);

   const audioPlayerState = useAppSelector(getPlayerState("general"));
   const audioPlayerStateAPI = new audioPlayerApi(dispatch, audioPlayerActions, "general");


   // ! 2) setGeneralAudioPlayerContext(panelAudioPlayerContext);
   const generalAudioPlayerContext = useAppSelector(getGeneralPlayerContext);

   // ! 1)
   const [activeTrackIdNumber, setActiveTrackIdNumber] = useState<number>(0);
   // ! 3)
   const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);

   const audios = useAppSelector(getPlayerAudioFiles("general"));
   const audioIds = useAppSelector(getPlayerAudioFileIds("general"));
   const [audioFiles, setAudioFiles] = useState<AudioFilesItem[]>([]);
   const [audiosBlockStyle, setAudiosBlockStyle] = useState<{ marginTop?: string }>({});
   const [currentPlaylistActive, setCurrentPlaylistActive] = useState<boolean>(false);

   const [audioLoadingStatuses, setAudioLoadingStatuses] = useState<boolean[]>(getFilledArray(false, audioFiles.length));
   const [numberOfAudioLoadedStatuses, setNumberOfAudioLoadedStatuses] = useState<number>(0);
   const [currentPostPlayerIsActive, setCurrentPostPlayerIsActive] = useState<boolean>(panelAudioPlayerContext === generalAudioPlayerContext ? true : false);




   const addAudio = (file: File | null, callback: () => void, type: "audio"): void => {
      if (file) {
         const audioObj: AudioFile = {
            src: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type,
         }

         audioPlayerStateAPI.addAudioFile(audioObj);
         setAudioFiles([
            ...audioFiles,
            {
               file,
               id: new Date().getTime(),
               ...audioObj,
            }
         ]);
      }

      callback();
   }


   const deleteAudio = (index: number): void => {
      const activeTrackIdNumber = audioIds.findIndex(id => id === audioPlayerState.activeTrackId);

      if (index === activeTrackIdNumber) {
         if (audioIds.length === 1) {
            audioPlayerStateAPI.setActiveTrackId(0);
         } else if (index === audioIds.length - 1) {
            audioPlayerStateAPI.setActiveTrackId(audioIds[index - 1]);
         } else {
            audioPlayerStateAPI.setActiveTrackId(audioIds[index + 1]);
         }
      }

      setAudioFiles(audioFiles.filter((item, i) => i !== index));
      audioPlayerStateAPI.removeAudioFile(audioIds[index]);
   }


   const getActiveTrackIdNumber = (activeTrackId: number): number => audioIds.findIndex(id => id === activeTrackId);


   const updateAudioLoadingStatusesItem = (index: number, newItemValue: boolean): void => {
      setAudioLoadingStatuses(getArrayWithUpdatedItemValue<boolean>(audioLoadingStatuses, index, newItemValue));
   }


   const resetAudios = (): void => {
      setAudioFiles([]);
      setShowAudioPlayer(false);
      audioPlayerStateAPI.resetPlayer();
   }


   const stopAudio = (): void => {
      audioPlayerStateAPI.setIsPlaying(false);
   }




   useEffect(() => {
      if (panelAudioPlayerContext !== generalAudioPlayerContext) {
         setCurrentPostPlayerIsActive(false);
      }
   }, [panelAudioPlayerContext, generalAudioPlayerContext])


   useEffect(() => {
      setAudioLoadingStatuses(getFilledArray(false, audioFiles.length));
   }, [audioFiles.length])


   // !
   useEffect(() => {
      if (panelAudioPlayerContext === "6E65700B-571A-4113-9206-6E832883BD99") {
         console.log("setActiveTrackIdNumber(getActiveTrackIdNumber(audioPlayerState.activeTrackId));")
      }
      if (audios[audioPlayerState.activeTrackId]) {
         setActiveTrackIdNumber(getActiveTrackIdNumber(audioPlayerState.activeTrackId));
      }
   }, [audioPlayerState.activeTrackId, audioIds.length])


   useEffect(() => {
      if (resize.value[0] <= 950) {
         if (showAudioPlayer) appContext.setShowAudioPlayer!(true);

         // } else {
      } else if (!showAudioPlayer && panelAudioPlayerContext === generalAudioPlayerContext) {
         appContext.setShowAudioPlayer!(false);
      }
   }, [showAudioPlayer, resize.value[0]])


   useEffect(() => {
      setAudioLoadingStatuses(getFilledArray(false, audioFiles.length));

      if (mode === "edit" && audioFiles.length === 0 && panelAudioPlayerContext === generalAudioPlayerContext) {
         audioPlayerStateAPI.resetPlayer();
         setAudioLoadingStatuses(getFilledArray(false, audioFiles.length));
         setShowPlayerOnPlayBtnClick!(false);
      }
   }, [audioFiles.length, panelAudioPlayerContext, generalAudioPlayerContext, mode])


   useEffect(() => {
      setNumberOfAudioLoadedStatuses(audioLoadingStatuses.filter(item => item === true).length);
   }, [audioLoadingStatuses])


   useEffect(() => {
      if (audioFiles.length > 0) {
         setAudiosBlockStyle({ marginTop: "15px" });
      } else {
         setAudiosBlockStyle({});

         if (mode === "edit" && panelAudioPlayerContext === generalAudioPlayerContext) {
            setShowAudioPlayer(false);
            audioPlayerStateAPI.setIsPlaying(false);
         }

      }
   }, [audioFiles.length, panelAudioPlayerContext, generalAudioPlayerContext, mode])


   useEffect(() => {
      if (audioPlayerState.isPlaying && !showAudioPlayer && audioFiles.length > 0 && panelAudioPlayerContext === generalAudioPlayerContext) {
         setShowAudioPlayer(true);
      } else if (audioFiles.length === 0 && generalAudioPlayerContext === panelAudioPlayerContext && mode === "edit") {
         setShowAudioPlayer(false);
      }
   }, [audioPlayerState.isPlaying, showAudioPlayer, audioFiles.length, panelAudioPlayerContext, generalAudioPlayerContext, mode]);


   useEffect(() => {
      if (!audioPlayerState.showAudioPlayer && panelAudioPlayerContext === generalAudioPlayerContext) {
         setShowAudioPlayer(false);
      } else {
         setShowPlayerOnPlayBtnClick!(true);
      }
   }, [audioPlayerState.showAudioPlayer, panelAudioPlayerContext, generalAudioPlayerContext])


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
   }, [showAudioPlayer, resize.value[0], generalAudioPlayerContext, panelAudioPlayerContext, generalAudioPlayerContext])


   useEffect(() => {
      if (mode === 'view') {
         setAudioFiles(
            post!.audios.map((item, index) => ({
               ...item,
               id: new Date().getTime() + index
            }))
         );
      }
   }, [mode])


   useEffect(() => {
      if (panelAudioPlayerContext === generalAudioPlayerContext && showAudioPlayer) {
         console.log(audioIds, audioPlayerState.activeTrackId);
      }

      if (
         panelAudioPlayerContext === generalAudioPlayerContext
         && showAudioPlayer
         && !currentPostPlayerIsActive
      ) {
         audioPlayerStateAPI.setAudioFiles(
            audioFiles.map(item => ({
               name: item.name,
               size: item.size,
               src: item.src,
               type: item.type,
               id: item.id
            }))
         );

         setCurrentPostPlayerIsActive(true);
      }
   }, [panelAudioPlayerContext, generalAudioPlayerContext, audioFiles.length, showAudioPlayer, currentPostPlayerIsActive])



   // // !
   // useEffect(() => {
   //    if (panelAudioPlayerContext === "6E65700B-571A-4113-9206-6E832883BD99") {
   //       console.log("audioPlayerState: ", audioPlayerState)
   //    }
   // }, [audioPlayerState])
   // // !


   // !
   useEffect(() => {
      if (panelAudioPlayerContext === "6E65700B-571A-4113-9206-6E832883BD99") {
         console.log("audioPlayerStateAPI.setActiveTrackId(audioIds[activeTrackIdNumber]);");
      }

      if (audioIds[activeTrackIdNumber] && panelAudioPlayerContext === generalAudioPlayerContext) {
         audioPlayerStateAPI.setActiveTrackId(audioIds[activeTrackIdNumber]);
      }
   }, [activeTrackIdNumber, audioIds.length, audioIds[0], panelAudioPlayerContext, generalAudioPlayerContext])


   useEffect(() => {
      if (audioPlayerState.showAudioPlayer && panelAudioPlayerContext === generalAudioPlayerContext) {
         setCurrentPlaylistActive(true);
      } else {
         setCurrentPlaylistActive(false);
      }
   }, [audioPlayerState.showAudioPlayer, panelAudioPlayerContext, generalAudioPlayerContext])


   useEffect(() => {
      if (!audioPlayerState.showAudioPlayer) {
         audioPlayerStateAPI.setGeneralPlayerContext("")
         audioPlayerStateAPI.resetPlayer();
      }
   }, [audioPlayerState.showAudioPlayer])



   return {
      stopAudio,
      audioFiles,
      currentPlaylistActive,
      setActiveTrackIdNumber,
      activeTrackIdNumber,
      audiosBlockStyle,
      audioPlayerState,
      audioPlayerStateAPI,
      audioLoadingStatuses,
      numberOfAudioLoadedStatuses,
      setShowAudioPlayer,
      updateAudioLoadingStatusesItem,
      addAudio,
      deleteAudio,
      resetAudios,
      generalAudioPlayerContext,
      setCurrentPostPlayerIsActive,
      setGeneralPlayerContext: () => audioPlayerStateAPI.setGeneralPlayerContext(panelAudioPlayerContext),
   }
}