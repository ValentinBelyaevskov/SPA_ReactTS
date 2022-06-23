import Ticker from "./Ticker"
import styles from './Thumbnail.module.scss'
import Full from "./Full"
import ControlsPanel from "./ControlsPanel"
import { PlayerName } from "./types/types"
import { audioPlayerActions, getPlayerConfig, getPlayerState } from "./redux/audioPlayerReducer"
import { useAppDispatch, useAppSelector } from "hooks/redux"
import { useEffect } from "react"
import { useElementEventHandlers } from "hooks/useElementEventHandlers"




type Props = {
   playerName: PlayerName
}




const Thumbnail = (props: Props) => {
   const dispatch = useAppDispatch();
   const config = useAppSelector(getPlayerConfig(props.playerName));
   const state = useAppSelector(getPlayerState(props.playerName));
   const playListEvents = useElementEventHandlers(
      ["touchmove", "touchstart", "click", "resize"],
      playListEventsCallback,
      [".fullPlayerWithPlaylist"]);




   function playListEventsCallback() {
      dispatch(audioPlayerActions.setShowPlaylist({ name: props.playerName, showPlaylist: false }));
   }

   function tickerClickListener(): void {
      playListEvents.addEventListener();
   }




   useEffect(() => {
      return () => {
         playListEvents.removeEventListener();
      }
   }, [])



   return (
      <>
         <div
            className={`
               ${styles.audioPlayer}
               ${config.thumbnail && config.thumbnail.needBoxShadow ? styles.boxShadow : ""}
               unselectable
               fullPlayerWithPlaylist
            `}
            style={
               config!.thumbnail && config!.thumbnail.style
                  ? config!.thumbnail.style
                  : undefined
            }
         >
            <div className={`${styles.tickerAndControlsContainer} ${styles.thumbnail}`}>
               <Ticker playerName={props.playerName} mode="thumbnail" tickerClickListener={tickerClickListener} />
               <ControlsPanel playerName={props.playerName} mode="thumbnail" />
            </div>
         </div>
         {
            state!.showPlaylist && config!.thumbnail && config!.thumbnail.showFullPlayer && (
               <Full playerName={props.playerName} />
            )
         }
      </>
   )
}




export default Thumbnail