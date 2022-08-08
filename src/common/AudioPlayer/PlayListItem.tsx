import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import styles from './PlayListItem.module.scss';
import NotVisibleParameterValue from 'common/NotVisibleParameterValue/NotVisibleParameterValue';
import { useState } from 'react';
import { useEffect } from 'react';
import getFileNameAndFormat from 'functions/getFileNameAndFormat';
import { AudioFile } from './types/types';
import { ConfigForAdaptability } from 'common/NotVisibleParameterValue/useSetParameterSize';




type Props = {
   index: number
   id: number
   audioFile: AudioFile
   activeTrackId: number
   setActiveTrackId: (activeTrack: number) => void
   updateAudioLoadingStatusesItem: (itemIndex: number, newItemValue: boolean) => void
   loadingStatus: boolean
   numberOfLoadedStatuses: number
   audioIsPlaying: boolean
   setAudioIsPlaying: (audioIsPlaying: boolean) => void
   trackNameAdaptability: ConfigForAdaptability
   playListLoaded: boolean
   trackNamesBreakPoint: number | undefined
   addClassNameForMobileDevices?: boolean
}




const PlayListItem = (props: Props) => {
   const audioLinkHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const file = props.audioFile;

   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [audioIcon, setAudioIcon] = useState<"./icons/playCircleTheme.svg" | "./icons/pauseCircleTheme.svg">("./icons/playCircleTheme.svg");
   const [audioIconClassName, setAudioIconClassName] = useState<string>(styles.audioIcon);
   const [audioNameWithFormat, setAudioNameWithFormat] = useState<string>(file.name!);
   const [visibleParameterValue, setVisibleParameterValue] = useState<string | undefined | number | null>(file.name!);
   const [stringWithLineBreak, setStringWithLineBreak] = useState<(JSX.Element | string)[]>([]);
   const [isTheValueLong, setIsTheValueLong] = useState<boolean | undefined>(undefined);
   const [active, setActive] = useState<boolean>(false);




   const getFileFormat = (name: string): string => getFileNameAndFormat(name)[1];

   const audioClickHandler = (): void => {
      audioLinkHoverAndTouchClassNames.clickListener();
      setIsPlaying(!isPlaying);
      props.setAudioIsPlaying(!isPlaying);
      props.setActiveTrackId(props.id);
   }




   useEffect(() => {
      if (isTheValueLong !== undefined) {
         if (isTheValueLong) {
            if (visibleParameterValue !== file.name) {
               if (props.loadingStatus === false) props.updateAudioLoadingStatusesItem(props.index, true);
            }

         } else {
            if (props.loadingStatus === false) props.updateAudioLoadingStatusesItem(props.index, true);
         }
      }
   }, [
      visibleParameterValue,
      isTheValueLong,
      file.name,
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
            // props.setActiveTrackId(props.id);
         };
      }
   }, [props.audioIsPlaying, props.id, props.activeTrackId, isPlaying])


   useEffect(() => {
      if (props.activeTrackId === props.id) {
         setActive(true);
      }
   }, [props.id, props.activeTrackId])


   useEffect(() => {
      if (props.id !== props.activeTrackId) {
         setActive(false);
      }
   }, [props.id, props.activeTrackId])


   useEffect(() => {
      if (isTheValueLong && visibleParameterValue) {
         setAudioNameWithFormat(`${`${visibleParameterValue}`.slice(0, -6)}... .${getFileFormat(file.name!)}`);
      } else {
         setAudioNameWithFormat(file.name!);
      }
   }, [file.name, visibleParameterValue])




   return (
      <div className={
         `
         ${styles.audiosListItem}
         ${active ? styles.active : ""}
         ${props.addClassNameForMobileDevices ? styles.mobile : ""}
         unselectable
         `
      }>
         {
            <div
               className={`${styles.audioNameContainer} ${audioLinkHoverAndTouchClassNames.className}`}
               onClick={audioClickHandler}
               onMouseEnter={audioLinkHoverAndTouchClassNames.mouseEnterListener}
               onTouchStart={audioLinkHoverAndTouchClassNames.touchStartListener}
               onTouchEnd={audioLinkHoverAndTouchClassNames.touchEndListener}
            >
               {
                  props.playListLoaded
                     ? (
                        <>
                           <div className={styles.audioIconContainer}>
                              <img className={audioIconClassName} src={audioIcon} alt={`${file.type} ${file.name}`} />
                           </div>
                           <p className={`${styles.audioName} unselectable`}>
                              {audioNameWithFormat}
                           </p>
                        </>
                     )
                     : (
                        <>
                           <div className={styles.audioIconContainer}>
                           </div>
                           <p className={`${styles.audioName} unselectable`}>
                              {""}
                           </p>
                        </>
                     )
               }
            </div >
         }
         <NotVisibleParameterValue
            parameterValue={file.name}
            setIsTheValueLong={setIsTheValueLong}
            setStringWithLineBreak={setStringWithLineBreak}
            setVisibleParameterValue={setVisibleParameterValue}
            className={styles.notVisibleValue}
            configForAdaptability={
               props.trackNameAdaptability
                  ? props.trackNameAdaptability
                  : [
                     [525, undefined, 425, 35],
                  ]}
            renderBreackPoint={props.trackNamesBreakPoint ? props.trackNamesBreakPoint : 950}
         />
      </div >
   )
}




export default PlayListItem