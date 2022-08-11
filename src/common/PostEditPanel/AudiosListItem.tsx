import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import styles from './AudiosListItem.module.scss'
import NotVisibleParameterValue from 'common/NotVisibleParameterValue/NotVisibleParameterValue';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import getFileNameAndFormat from 'functions/getFileNameAndFormat';
import { AudioFilesItem } from './hooks/useAudiosBlock';
import { convertSecondsToMs } from 'common/AudioPlayer/functions.ts/convertSecondsToMs';
import { DataType } from './hooks/usePostLoadingStatus';




type Props = {
   index: number
   mode: "edit" | "view"
   file: AudioFilesItem
   currentPlaylistActive: boolean
   deleteAudio: (index: number) => void
   activeTrackIdNumber: number
   audioIsPlaying: boolean
   setAudioIsPlaying: (isPlaying: boolean) => void
   setShowAudioPlayer: React.Dispatch<React.SetStateAction<boolean>>
   setActiveTrackIdNumber: React.Dispatch<React.SetStateAction<number>>
   loadingStatus: boolean
   updateAudioLoadingStatusesItem: (itemIndex: number, newItemValue: boolean) => void
   numberOfLoadedStatuses: number
   setGeneralPlayerContext: () => void
   updateLoadingStatusesItem?: (index: number, newItemValue: boolean, dataType: DataType) => void
}




const AudiosListItem = (props: Props) => {
   const hideIconHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const audioLinkHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);

   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [audioIcon, setAudioIcon] = useState<"./icons/playCircleTheme.svg" | "./icons/pauseCircleTheme.svg">("./icons/playCircleTheme.svg");
   const [audioIconClassName, setAudioIconClassName] = useState<string>(styles.audioIcon);
   const [audioNameWithFormat, setAudioNameWithFormat] = useState<string>(props.file.name!);
   const [visibleParameterValue, setVisibleParameterValue] = useState<string | undefined | number | null>(props.file.name!);
   const [stringWithLineBreak, setStringWithLineBreak] = useState<(JSX.Element | string)[]>([]);
   const [isTheValueLong, setIsTheValueLong] = useState<boolean | undefined>(undefined);
   const [active, setActive] = useState<boolean>(false);
   const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
   const audioRef = useRef<HTMLAudioElement>(null);
   const [trackDuration, setTrackDuration] = useState<string | undefined>(undefined);
   const [expectContextMatch, setExpectContextMatch] = useState<boolean>(false);




   const getFileFormat = (name: string): string => getFileNameAndFormat(name)[1];

   const audioClickHandler = (): void => {
      audioLinkHoverAndTouchClassNames.clickListener();

      if (props.currentPlaylistActive) {
         setIsPlaying(!isPlaying);
         props.setAudioIsPlaying(!isPlaying);
      } else {
         setExpectContextMatch(true);
      }

      props.setActiveTrackIdNumber(props.index);
      props.setGeneralPlayerContext();
      props.setShowAudioPlayer(true);
   }

   const hideIconClickHandler = (): void => {
      hideIconHoverAndTouchClassNames.clickListener();
      props.deleteAudio(props.index);

      if (
         props.index === props.activeTrackIdNumber
         && props.currentPlaylistActive
      ) {
         setIsPlaying(false);
         props.setAudioIsPlaying(false);
      }
   }

   const audioLoadListener = () => {
      if (audioRef.current) {
         setTrackDuration(convertSecondsToMs(+audioRef.current.duration.toFixed(2)))
         if (props.updateLoadingStatusesItem) {
            props.updateLoadingStatusesItem(props.index, true, "audio");
         }
      }
   }




   useEffect(() => {
      if (expectContextMatch && props.currentPlaylistActive) {
         setIsPlaying(!isPlaying);
         props.setAudioIsPlaying(!isPlaying);
         setExpectContextMatch(false);
      }
   }, [expectContextMatch, props.currentPlaylistActive])


   useEffect(() => {
      if (isTheValueLong !== undefined) {
         if (isTheValueLong) {
            if (visibleParameterValue !== props.file.name) {
               if (props.loadingStatus === false) {
                  props.updateAudioLoadingStatusesItem(props.index, true);
                  setLoadingStatus(true);
               }
            }

         } else {
            if (props.loadingStatus === false) {
               props.updateAudioLoadingStatusesItem(props.index, true);
               setLoadingStatus(true);
            }
         }
      }
   }, [
      visibleParameterValue,
      isTheValueLong,
      props.file.name,
      props.loadingStatus,
      props.index,
      props.numberOfLoadedStatuses
   ])


   useEffect(() => {
      if (isPlaying) {
         setAudioIcon('./icons/pauseCircleTheme.svg');
         setAudioIconClassName(styles.animatedAudioIcon);
      } else {
         setAudioIcon('./icons/playCircleTheme.svg');
         setAudioIconClassName(styles.audioIcon);
      }
   }, [isPlaying])

   // ! При удалении элементов неправильно задаётся свойство active
   // При удалении первого трека, в момент проигрыша другого, сбиваются значения

   useEffect(() => {
      if (props.index !== props.activeTrackIdNumber || !props.currentPlaylistActive) {
         setIsPlaying(false);
      }
   }, [isPlaying, props.index, props.activeTrackIdNumber, props.currentPlaylistActive])


   useEffect(() => {
      if (props.index === props.activeTrackIdNumber && props.currentPlaylistActive) {
         setIsPlaying(props.audioIsPlaying);

         if (isPlaying) {
            setActive(true);
         }
      }
   }, [props.audioIsPlaying, props.index, props.activeTrackIdNumber, isPlaying, props.currentPlaylistActive])


   useEffect(() => {
      if (isTheValueLong && visibleParameterValue) {
         setAudioNameWithFormat(`${`${visibleParameterValue}`.slice(0, -6)}... .${getFileFormat(props.file.name!)}`);
      } else {
         setAudioNameWithFormat(props.file.name!);
      }
   }, [props.file.name, visibleParameterValue])


   useEffect(() => {
      if (props.index !== props.activeTrackIdNumber || !props.currentPlaylistActive) {
         setActive(false);
      }
   }, [props.index, props.activeTrackIdNumber, props.currentPlaylistActive])




   return (
      <>
         <div className={`${styles.audiosListItem} ${styles[props.mode]} ${active ? styles.active : ""} unselectable`}>
            {
               loadingStatus
                  ? (
                     <>
                        <div
                           className={`${styles.audioNameContainer} ${audioLinkHoverAndTouchClassNames.className}`}
                           onClick={audioClickHandler}
                           onMouseEnter={audioLinkHoverAndTouchClassNames.mouseEnterListener}
                           onTouchStart={audioLinkHoverAndTouchClassNames.touchStartListener}
                           onTouchEnd={audioLinkHoverAndTouchClassNames.touchEndListener}
                        >
                           <div className={styles.audioIconContainer}>
                              <img className={audioIconClassName} src={audioIcon} alt={`${props.file.type} ${props.file.name}`} />
                           </div>
                           <p className={`${styles.audioName} unselectable`}>
                              {audioNameWithFormat}
                           </p>
                        </div >
                        <div className={styles.trackDuration}>
                           {trackDuration}
                        </div>
                        <img
                           className={`${styles.hideIcon} ${hideIconHoverAndTouchClassNames.className}`}
                           src="./icons/hideMini.svg"
                           alt="hide icon"
                           onClick={hideIconClickHandler}
                           onMouseEnter={hideIconHoverAndTouchClassNames.mouseEnterListener}
                           onTouchStart={hideIconHoverAndTouchClassNames.touchStartListener}
                           onTouchEnd={hideIconHoverAndTouchClassNames.touchEndListener}
                        />
                     </>
                  )
                  : (
                     <>
                        <div style={{ opacity: 0 }} className={`${styles.audioNameContainer} ${audioLinkHoverAndTouchClassNames.className}`}>
                           <div className={styles.audioIconContainer}>
                              <img className={audioIconClassName} src={audioIcon} />
                           </div>
                           <p className={`${styles.audioName} unselectable`}>{""}</p>
                        </div >
                        <img
                           style={{ opacity: 0 }}
                           className={`${styles.hideIcon} ${hideIconHoverAndTouchClassNames.className}`}
                           src="./icons/hideMini.svg"
                        />
                     </>
                  )
            }
            <audio
               ref={audioRef}
               src={props.file.src}
               onLoadedData={audioLoadListener}
            >
            </audio>
            <NotVisibleParameterValue
               parameterValue={props.file.name}
               setIsTheValueLong={setIsTheValueLong}
               setStringWithLineBreak={setStringWithLineBreak}
               setVisibleParameterValue={setVisibleParameterValue}
               className={styles.notVisibleValue}
               configForAdaptability={[
                  [550, undefined, 415, 35],
                  [500, 549, 360, 30],
                  [461, 499, 320, 22],
                  [400, 460, 250, 18],
                  [320, 399, 180, 12],
                  [280, 320, 145, 10],
               ]}
            />
         </div >
      </>
   )
}




export default AudiosListItem