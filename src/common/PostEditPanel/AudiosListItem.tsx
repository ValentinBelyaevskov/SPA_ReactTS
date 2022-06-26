import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import styles from './AudiosListItem.module.scss'
import NotVisibleParameterValue from 'common/NotVisibleParameterValue/NotVisibleParameterValue';
import { useState } from 'react';
import { useEffect } from 'react';
import getFileNameAndFormat from 'functions/getFileNameAndFormat';
import { AudioFile } from 'common/AudioPlayer/types/types';




type Props = {
   index: number
   id: number
   file: AudioFile
   deleteAudio: (id: number, index: number) => void
   activeTrackId: number
   setActiveTrackId: (activeTrackId: number) => void
   audioIsPlaying: boolean
   setAudioIsPlaying: (isPlaying: boolean) => void
   setShowAudioPlayer: React.Dispatch<React.SetStateAction<boolean>>
   setActiveTrack: (activeTrack: number) => void
   loadingStatus: boolean
   updateLoadingStatusesItem: (itemIndex: number, newItemValue: boolean) => void
   numberOfLoadedStatuses: number
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




   const getFileFormat = (name: string): string => getFileNameAndFormat(name)[1];

   const audioClickHandler = (): void => {
      audioLinkHoverAndTouchClassNames.clickListener();
      setIsPlaying(!isPlaying);
      props.setAudioIsPlaying(!isPlaying);
      props.setActiveTrack(props.id);
      props.setShowAudioPlayer(true);
   }

   const hideIconClickHandler = (): void => {
      hideIconHoverAndTouchClassNames.clickListener();
      props.deleteAudio(props.id, props.index);

      if (
         props.id === props.activeTrackId
      ) {
         setIsPlaying(false);
         props.setAudioIsPlaying(false);
      }
   }




   useEffect(() => {
      if (isTheValueLong !== undefined) {
         if (isTheValueLong) {
            if (visibleParameterValue !== props.file.name) {
               if (props.loadingStatus === false) {
                  props.updateLoadingStatusesItem(props.index, true);
                  setLoadingStatus(true);
               }
            }

         } else {
            if (props.loadingStatus === false) {
               props.updateLoadingStatusesItem(props.index, true);
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


   useEffect(() => {
      if (props.id !== props.activeTrackId) {
         setIsPlaying(false);
      }
   }, [isPlaying, props.id, props.activeTrackId])


   useEffect(() => {
      if (props.id === props.activeTrackId) {
         setIsPlaying(props.audioIsPlaying);
         if (isPlaying) {
            setActive(true);
            props.setActiveTrack(props.id);
         }
      }
   }, [props.audioIsPlaying, props.id, props.activeTrackId, isPlaying])


   useEffect(() => {
      if (isTheValueLong && visibleParameterValue) {
         setAudioNameWithFormat(`${`${visibleParameterValue}`.slice(0, -6)}... .${getFileFormat(props.file.name!)}`);
      } else {
         setAudioNameWithFormat(props.file.name!);
      }
   }, [props.file.name, visibleParameterValue])


   useEffect(() => {
      if (props.id !== props.activeTrackId) {
         setActive(false);
      }
   }, [props.id, props.activeTrackId])




   return (
      <>
         <div className={`${styles.audiosListItem} ${active ? styles.active : ""} unselectable`}>
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