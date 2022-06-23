import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useContext, useEffect, useState } from "react";
import styles from './ControlsPanel.module.scss'
import ControlsPanelButton from "./ControlsPanelButton";
import { getSwitchToNextTrackFunc } from "./functions.ts/getSwitchToNextTrackFunc";
import { audioPlayerActions, getCommonTrackSliderProps, getCommonVolumeSliderProps, getPlayerAudioFileIds, getPlayerConfig, getPlayerState } from './redux/audioPlayerReducer';
import { PlayerName, PlayerMode } from './types/types';
import { audioPlayerApi } from './API/audioPlayerAPI';
import { getSwitchToPrevTrackFunc } from "./functions.ts/getSwitchToPrevTrackFunc";
import { getVolumeSliderChangeListener } from "./functions.ts/getVolumeSliderChangeListener";
import { AudioPlayerContext } from "./useAudioPlayer";




type Props = {
   playerName: PlayerName
   mode: PlayerMode
   loadListener?: () => void
}


export type ButtonConfig = {
   element: "img" | "slider" | "button"
   name: "play" | "prev" | "next" | "soundToggler" | "volume" | "playbackRate"
   clickHandler?: () => void
   onChange?: () => void
   percentage?: number
   prevPercentage?: number
   togglerValue?: boolean
   buttonValue?: number | string
   windowSize?: [number, number]
   text?: string
   callback?: (value: number) => void
   showPlaylist?: boolean
   activeTrackId?: number
   renderEventSubscriber?: () => void
   fileIdsLength?: number
}




const ControlsPanel = (props: Props) => {
   const dispatch = useAppDispatch();
   const playerContext = useContext(AudioPlayerContext)
   const audioElement = playerContext.getPlayerElement!(props.playerName);

   const config = useAppSelector(getPlayerConfig(props.playerName));
   const audioFileIds = useAppSelector(getPlayerAudioFileIds(props.playerName));
   const state = useAppSelector(getPlayerState(props.playerName));
   const commonVolumeSliderProps = useAppSelector(getCommonVolumeSliderProps);
   const commonTrackSliderProps = useAppSelector(getCommonTrackSliderProps);
   const stateAPI = new audioPlayerApi(dispatch, audioPlayerActions, props.playerName);
   const [smallWidthClassName, setSmallWidthClassName] = useState<string | undefined>(undefined);

   const [theLastButtonWasRendered, setTheLastButtonWasRendered] = useState<boolean>(false);




   const switchToNextTrack = getSwitchToNextTrackFunc(
      stateAPI.setActiveTrackId,
      stateAPI.setIsPlaying
   );

   const switchToPrevTrack = getSwitchToPrevTrackFunc(
      stateAPI.setActiveTrackId,
      stateAPI.setIsPlaying
   );

   const volumeSliderChangeListener = getVolumeSliderChangeListener(
      audioElement!,
      (volumePercentage: number) => {
         stateAPI.setCommonVolumeSliderProps({
            ...commonVolumeSliderProps,
            volumePercentage
         })
      }
   );

   function playClickHandler(): void {
      stateAPI.setIsPlaying(!state.isPlaying);
   }

   function soundTogglerClickHandler(): void {
      stateAPI.setCommonVolumeSliderProps({
         ...commonVolumeSliderProps,
         soundTogglerValue: !commonVolumeSliderProps.soundTogglerValue
      })
   }

   function speedClickHandler(): void {
      if (commonTrackSliderProps.playbackRate === 1) {
         stateAPI.setCommonTrackSliderProps({
            playbackRate: 2
         })
      } else {
         stateAPI.setCommonTrackSliderProps({
            playbackRate: 1
         })
      }
   }



   const buttons: ButtonConfig[] = [
      {
         clickHandler: playClickHandler,
         element: "img",
         name: "play",
         togglerValue: state.isPlaying
      },
      {
         clickHandler: () => switchToPrevTrack(state.activeTrackId, audioFileIds),
         element: "img",
         name: "prev",
         activeTrackId: state.activeTrackId,
         fileIdsLength: audioFileIds.length
      },
      {
         clickHandler: () => switchToNextTrack(state.activeTrackId, audioFileIds),
         element: "img",
         name: "next",
         activeTrackId: state.activeTrackId,
         fileIdsLength: audioFileIds.length
      },
      {
         clickHandler: soundTogglerClickHandler,
         element: "img",
         name: "soundToggler",
         togglerValue: commonVolumeSliderProps.soundTogglerValue,
         prevPercentage: commonVolumeSliderProps.prevVolumePercentage,
         percentage: commonVolumeSliderProps.volumePercentage,
      },
      {
         element: "slider",
         name: "volume",
         windowSize: state.windowSize,
         percentage: commonVolumeSliderProps.volumePercentage,
         togglerValue: commonVolumeSliderProps.soundTogglerValue,
         callback: volumeSliderChangeListener,
         showPlaylist: state.showPlaylist
      },
      {
         clickHandler: speedClickHandler,
         element: "button",
         name: "playbackRate",
         text: "2X",
         buttonValue: commonTrackSliderProps.playbackRate,
         renderEventSubscriber: () => setTheLastButtonWasRendered(true)
      },
   ]




   useEffect(() => {
      if (props.loadListener) props.loadListener();
   }, [theLastButtonWasRendered])


   useEffect(() => {
      if (
         props.mode === "full"
         && config.adaptToWindowSize
         && config.full && config.full.maxSizeForSmallWidthPlayer
         && state.windowSize[0] <= config.full.maxSizeForSmallWidthPlayer
      ) {
         setSmallWidthClassName(styles.smallWidthPanel);
      } else {
         setSmallWidthClassName(undefined);
      }
   }, [props.mode, config.adaptToWindowSize, state.windowSize[0]])




   return (
      <div
         className={
            `
            ${styles.controlsPanel}
            ${props.mode === "thumbnail"
               ? styles.thumbnail
               : ""}
            ${smallWidthClassName}
            ${config.adaptToWindowSize && config.mobileBreakPoint && state.windowSize[0] <= config.mobileBreakPoint
               ? styles.mobile
               : ""}
            `
         }
      >
         {buttons.map(item => (
            <ControlsPanelButton
               key={item.name}
               buttonConfig={item}
            />
         ))}
      </div>
   )
}




export default ControlsPanel