import { useContext, useEffect, useRef } from 'react';
import { useTrackSlider } from './hooks/useTrackSlider';
import { useVolumeSlider } from './hooks/useVolumeSlider';
import { PlayerName } from './types/types';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { audioPlayerActions, getCommonTrackSliderProps, getCommonVolumeSliderProps, getPlayerAudioFileIds, getPlayerAudioFiles, getPlayerConfig, getPlayerState, getTrackSliderProps } from './redux/audioPlayerReducer';
import { audioPlayerApi } from './API/audioPlayerAPI';
import { useWindowSize } from 'hooks/useWindowSize';
import { AudioPlayerContext } from './useAudioPlayer';




type Props = {
   name: PlayerName
}




const AudioElementsItem = (props: Props) => {
   const dispatch = useAppDispatch();
   const playerContext = useContext(AudioPlayerContext);

   const stateAPI = new audioPlayerApi(dispatch, audioPlayerActions, props.name);

   const config = useAppSelector(getPlayerConfig(props.name));
   const state = useAppSelector(getPlayerState(props.name));
   const audioFileIds = useAppSelector(getPlayerAudioFileIds(props.name));
   const audioFiles = useAppSelector(getPlayerAudioFiles(props.name));
   const trackSliderProps = useAppSelector(getTrackSliderProps(props.name));
   const commonTrackSliderProps = useAppSelector(getCommonTrackSliderProps);
   const commonVolumeSliderProps = useAppSelector(getCommonVolumeSliderProps);

   const audioRef = useRef<HTMLAudioElement>(null);

   const windowSize = useWindowSize("resize");




   function getCurrentTimeAndDuration(): void {
      const audio = audioRef.current!;

      if (trackSliderProps.percentageCanBeChanged) {

         stateAPI.setTrackSliderProps({
            ...trackSliderProps,
            trackPercentage: +((audio.currentTime / audio.duration) * 100).toFixed(2),
            currentTime: audio.currentTime.toFixed(2),
            duration: audio.duration.toFixed(2)
         })
      }
   }


   function setCurrentSpeed(): void {
      const audio = audioRef.current!;
      audio.playbackRate = commonTrackSliderProps.playbackRate;
   }


   function audioLoadHandler(): void {
      const audio = audioRef.current!;

      if (config.isPlaying) audio.play();

      audio.volume = commonVolumeSliderProps.volumePercentage / 100;

      getCurrentTimeAndDuration();
      setCurrentSpeed();

      stateAPI.setAudioUploaded(true);
   }




   useTrackSlider(
      props.name,
      audioRef.current!,
      state,
      audioFileIds,
      trackSliderProps,
      stateAPI.setActiveTrackId,
      stateAPI.setIsPlaying,
      stateAPI.setTrackSliderProps,
   );

   useVolumeSlider(
      state,
      audioRef.current!,
      commonVolumeSliderProps,
      stateAPI.setCommonVolumeSliderProps
   );


   useEffect(() => {
      if (audioRef.current && state.audioUploaded) {
         if (props.name === 'popup') {
            playerContext.setPopupAudioElement!(audioRef.current);
         } else if (props.name === 'general') {
            playerContext.setGeneralAudioElement!(audioRef.current);
         }
      }
   }, [props.name, audioRef.current, state.audioUploaded])


   useEffect(() => {
      if (audioRef.current && state.audioUploaded) {
         stateAPI.setShowAudioPlayer(config.showAudioPlayer);
      }

   }, [
      state.audioUploaded,
      audioRef.current,
      config.showAudioPlayer,
      config.isPlaying,
      config.activeTrackId
   ])


   useEffect(() => {
      if (audioRef.current && state.audioUploaded) {
         if (!state.isPlaying) stateAPI.setIsPlaying(config.isPlaying);
      }
   }, [state.audioUploaded, audioRef.current, state.isPlaying])


   useEffect(() => {
      if (audioFileIds.length === 1 && config!.mode === 'full') {
         stateAPI.setShowPlaylist(false);
      }
   }, [audioFileIds.length, state.showPlaylist, config!.mode])


   useEffect(() => {
      if (state.audioUploaded && audioRef.current!) {
         const audio = audioRef.current!;

         audio.playbackRate = commonTrackSliderProps.playbackRate;
      }
   }, [audioRef.current, state.audioUploaded, commonTrackSliderProps.playbackRate])


   useEffect(() => {
      if (!state.showPlaylist) {
         stateAPI.setPlaylistLoaded(false);
      }
   }, [state.showPlaylist])


   useEffect(() => {
      if (
         audioFileIds.length === 1
         && !audioFiles[state.activeTrackId]
         && `${config.activeTrackId}`.length === 1
         && config.activeTrackId >= 0
         && config.activeTrackId < audioFileIds.length
         && audioFileIds.length > 0
      ) {
         stateAPI.setActiveTrackId(audioFileIds[0]);
      }
   }, [config.activeTrackId, audioFiles[state.activeTrackId], audioFileIds.length])


   useEffect(() => {
      if (config.adaptToWindowSize) {
         windowSize.addEventListener();
      }
   }, [config.adaptToWindowSize])


   useEffect(() => {
      if (config.adaptToWindowSize) {
         stateAPI.setWindowSize(windowSize.value);
      }
   }, [config.adaptToWindowSize, windowSize.value[0], windowSize.value[1]])


   useEffect(() => {
      return () => {
         windowSize.removeEventListener();
      }
   }, [])




   return (
      audioFileIds.length > 0
         && state.activeTrackId !== 0
         && audioFiles[state.activeTrackId]
         ? (
            <audio
               ref={audioRef}
               src={audioFiles[state.activeTrackId].src}
               onLoadedData={audioLoadHandler}
               onTimeUpdate={getCurrentTimeAndDuration}
            >
            </audio>
         )
         : <></>
   )
}




export default AudioElementsItem