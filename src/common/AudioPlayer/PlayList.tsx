import PlayListItem from './PlayListItem'
import styles from './PlayList.module.scss'
import { AudioFile, PlayerName } from './types/types'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { audioPlayerActions, getPlayerAudioFileIds, getPlayerAudioFiles, getPlayerConfig, getPlayerState } from './redux/audioPlayerReducer'
import { audioPlayerApi } from './API/audioPlayerAPI'
import { useEffect, useState } from 'react'
import { getArrayWithUpdatedItemValue } from '../../functions/getArrayWithUpdatedItemValue';
import { getFilledArray } from 'functions/getFiledArray'




export type PlayListConfig = {
   audioFiles: AudioFile[]
   itemIndex: number
   setItemIndex: React.Dispatch<React.SetStateAction<number>>
   isPlaying: boolean
   setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

type Props = {
   playerName: PlayerName
}




const PlayList = (props: Props) => {
   const dispatch = useAppDispatch();
   const config = useAppSelector(getPlayerConfig(props.playerName));
   const state = useAppSelector(getPlayerState(props.playerName));
   const audioFileIds = useAppSelector(getPlayerAudioFileIds(props.playerName));
   const audioFiles = useAppSelector(getPlayerAudioFiles(props.playerName));
   const stateAPI = new audioPlayerApi(dispatch, audioPlayerActions, props.playerName);
   const [loadingStatuses, setLoadingStatuses] = useState<boolean[]>(getFilledArray(false, audioFileIds.length));
   const [numberOfLoadedStatuses, setNumberOfLoadedStatuses] = useState<number>(0);
   const [addClassNameForMobileDevices, setAddClassNameForMobileDevices] = useState<boolean>(false);




   const updateLoadingStatusesItem = (itemIndex: number, newItemValue: boolean): void => {
      setLoadingStatuses(getArrayWithUpdatedItemValue<boolean>(loadingStatuses, itemIndex, newItemValue));
   }




   useEffect(() => {
      setNumberOfLoadedStatuses(loadingStatuses.filter(item => item === true).length);

      if (!loadingStatuses.includes(false)) {
         setTimeout(() => {
            stateAPI.setPlaylistLoaded(true);
         }, 100)
      }
   }, [loadingStatuses])


   useEffect(() => {
      if (config.adaptToWindowSize && config.mobileBreakPoint && state.windowSize[0] <= config.mobileBreakPoint) {
         setAddClassNameForMobileDevices(true);
      } else {
         setAddClassNameForMobileDevices(false);
      }
   }, [config.adaptToWindowSize, config.mobileBreakPoint, state.windowSize[0]])




   return (
      <div className={styles.playListContainer}>
         <div className={styles.line}></div>
         <div className={
            `
         ${styles.playList}
         ${styles.thumbnailPlaylist}
         `
         }>
            {
               !state.playlistLoaded
               && <img className={styles.preloader} src="./animatedIcons/preloader2.svg" alt='preloader' />
            }
            {
               audioFileIds.map((id, index) => (
                  <PlayListItem
                     key={id}
                     index={index}
                     id={id}
                     audioFile={audioFiles[id]}
                     activeTrackId={state.activeTrackId}
                     setActiveTrackId={stateAPI.setActiveTrackId}
                     updateLoadingStatusesItem={updateLoadingStatusesItem}
                     loadingStatus={loadingStatuses[index]}
                     numberOfLoadedStatuses={numberOfLoadedStatuses}
                     audioIsPlaying={state.isPlaying}
                     setAudioIsPlaying={stateAPI.setIsPlaying}
                     trackNameAdaptability={config.trackNameAdaptability}
                     playListLoaded={state.playlistLoaded}
                     trackNamesBreakPoint={config.trackNamesBreakPoint}
                     addClassNameForMobileDevices={addClassNameForMobileDevices}
                  />
               ))
            }
         </div>
         <div className={styles.line}></div>
      </div>
   )
}




export default PlayList