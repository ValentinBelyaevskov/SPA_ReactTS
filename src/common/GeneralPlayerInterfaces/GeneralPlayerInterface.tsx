import { audioPlayerApi } from 'common/AudioPlayer/API/audioPlayerAPI';
import PlayerInterface from 'common/AudioPlayer/PlayerInterface';
import { audioPlayerActions, getPlayerStatus, getShowAudioPlayer } from 'common/AudioPlayer/redux/audioPlayerReducer';
import { AudioPlayerContext } from 'common/AudioPlayer/useAudioPlayer';
import { useAppSelector } from 'hooks/redux';
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import { useContext } from 'react';
import { useAppDispatch } from '../../hooks/redux';




interface Styles {
   readonly [key: string]: string
}

type Props = {
   containerRef?: React.RefObject<HTMLDivElement>
   styles: Styles
}




const GeneralPlayerInterface = (props: Props) => {
   const {
      showPlayerOnPlayBtnClick,
      setShowPlayerOnPlayBtnClick
   } = useContext(AudioPlayerContext);

   const playerStatus = useAppSelector(getPlayerStatus("general"));
   const showAudioPlayer = useAppSelector(getShowAudioPlayer("general"));
   const dispatch = useAppDispatch();
   const playerStateAPI = new audioPlayerApi(dispatch, audioPlayerActions, "general");
   const hideIconHoverAndTouchClassNames = useHoverAndTouchClassNames(props.styles.hover, props.styles.touch);



   const hideIconClickHandler = (): void => {
      hideIconHoverAndTouchClassNames.clickListener();

      playerStateAPI.setShowAudioPlayer(false);
      playerStateAPI.setIsPlaying(false);
   }



   return (
      <div className={`${props.styles.audioPlayerContainer} unselectable`} ref={props.containerRef}>
         {
            playerStatus
            && showAudioPlayer
            && (
               <div className={props.styles.smallWidthAudioPlayerWrapper}>
                  <div className={props.styles.audioPlayerWrapper}>
                     <PlayerInterface name="general" />
                  </div>
                  <img
                     className={`${props.styles.hideIcon} ${hideIconHoverAndTouchClassNames.className}`}
                     onClick={hideIconClickHandler}
                     onMouseEnter={hideIconHoverAndTouchClassNames.mouseEnterListener}
                     onTouchStart={hideIconHoverAndTouchClassNames.touchStartListener}
                     onTouchEnd={hideIconHoverAndTouchClassNames.touchEndListener}
                     src='./icons/hideMini.svg'
                     alt='hide player icon'
                  />
               </div>
            )
         }
      </div>
   )
}




export default GeneralPlayerInterface