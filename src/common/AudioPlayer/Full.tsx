import PlayList from "./PlayList"
import Slider from "./Slider"
import Ticker from "./Ticker"
import styles from './Full.module.scss'
import ControlsPanel from "./ControlsPanel"
import { PlayerName } from './types/types';
import { useAppDispatch, useAppSelector } from "hooks/redux"
import { audioPlayerActions, getPlayerConfig, getPlayerState, getTrackSliderProps, getPlayerAudioFileIds } from './redux/audioPlayerReducer';
import { audioPlayerApi } from "./API/audioPlayerAPI"
import { useContext, useState } from "react"
import { useTrackSliderChangeListener, TrackSliderPropsList } from "./hooks/useTrackSliderChangeListener"
import { convertSecondsToMs } from "./functions.ts/convertSecondsToMs"
import { AudioPlayerContext } from "./useAudioPlayer"



type Props = {
   playerName: PlayerName
}



const Full = (props: Props) => {
   const dispatch = useAppDispatch();
   const playerContext = useContext(AudioPlayerContext);
   const audioElement = playerContext.getPlayerElement!(props.playerName);
   const config = useAppSelector(getPlayerConfig(props.playerName));
   const state = useAppSelector(getPlayerState(props.playerName));
   const audioFileIds = useAppSelector(getPlayerAudioFileIds(props.playerName));
   const trackSliderProps = useAppSelector(getTrackSliderProps(props.playerName));
   const stateAPI = new audioPlayerApi(dispatch, audioPlayerActions, props.playerName);
   const [playerStyle, setPlayerStyle] = useState<{ opacity: 0 | 1 }>({ opacity: 0 });




   const trackSliderChangeListener = useTrackSliderChangeListener(
      audioElement!,
      state.audioUploaded,
      (props: TrackSliderPropsList) => {
         stateAPI.setTrackSliderProps({
            ...trackSliderProps,
            ...props
         })
      }
   )

   const controlsPanelLoadListener = (): void => {
      setPlayerStyle({ opacity: 1 });
   }




   return (
      <div
         className={
            `
            ${styles.audioPlayer}
            ${config.animatedOpacity ? styles.animatedOpacity : ""}
            ${config!.full && config!.full.needBoxShadow ? styles.boxShadow : ""}
            ${config.adaptToWindowSize && config.mobileBreakPoint && state.windowSize[0] <= config.mobileBreakPoint
               ? styles.mobile
               : ""}
            unselectable
            fullPlayerWithPlaylist
            `
         }
         style={
            {
               ...config!.full && config!.full.style
                  ? config!.full.style
                  : undefined,
               ...playerStyle
            }
         }
      >
         <div className={`${styles.tickerAndControlsContainer}`}>
            <Ticker playerName={props.playerName} mode="full" />
            {
               <>
                  <div className={styles.durationContainer}>
                     <div
                        className={`${styles.currentTime} unselectable`}
                     >
                        {convertSecondsToMs(+state!.trackSliderProps!.currentTime)}
                     </div>
                     <div className={`${styles.duration} unselectable`}>
                        {convertSecondsToMs(+state!.trackSliderProps!.duration)}
                     </div>
                  </div>
                  <Slider
                     windowSize={state.windowSize}
                     percentage={trackSliderProps.trackPercentage}
                     onChange={trackSliderChangeListener}
                  />
               </>
            }
            <ControlsPanel playerName={props.playerName} mode="full" loadListener={controlsPanelLoadListener} />
         </div>
         {
            state.showPlaylist
            && (audioFileIds.length > 1)
            && (
               <PlayList playerName={props.playerName} />
            )
         }
      </div>
   )
}

export default Full