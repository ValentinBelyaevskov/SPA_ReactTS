import { useEffect } from "react";
import { PlayerConfig, PlayerState, PlayerName, TrackSliderProps, AudioFiles } from '../types/types';
import { getSwitchToNextTrackFunc } from "../functions.ts/getSwitchToNextTrackFunc";



export const useTrackSlider = (
   playerName: PlayerName,
   audioElement: HTMLAudioElement,
   state: PlayerState,
   audioFileIds: number[],
   trackSliderProps: TrackSliderProps,
   setActiveTrackId: (itemIndex: number) => void,
   setIsPlaying: (isPlaying: boolean) => void,
   setTrackSliderProps: (trackSliderProps: TrackSliderProps) => void
): void => {

   const switchToNextTrack = getSwitchToNextTrackFunc(
      setActiveTrackId,
      setIsPlaying
   );



   useEffect(() => {
      if (state.audioUploaded && audioElement!) {
         const audio = audioElement!;

         if (trackSliderProps.trackPercentage === 100 && state.isPlaying) {
            audio.currentTime = 0;

            setTrackSliderProps({ ...trackSliderProps, trackPercentage: 0 })

            if (audioFileIds.length === 1) {
               setIsPlaying(false);
            } else if (audioFileIds.length > 1 && state.activeTrackId < audioFileIds.length - 1) {
               switchToNextTrack(state.activeTrackId, audioFileIds);
            } else if (audioFileIds.length > 1 && state.activeTrackId === audioFileIds.length - 1) {
               switchToNextTrack(state.activeTrackId, audioFileIds);
               setIsPlaying(false);
            }
         }
      }
   }, [
      playerName,
      trackSliderProps.trackPercentage,
      state.audioUploaded,
      audioFileIds.length,
      audioElement!,
      state.isPlaying,
      state.activeTrackId
   ])


   useEffect(() => {
      if (state.audioUploaded && audioElement!) {
         const audio = audioElement!;

         if (state.isPlaying && state.trackSliderProps.trackPercentage !== 100) {
            audio.play();
         } else {
            audio.pause();
         }
      }
   }, [state.isPlaying, state.audioUploaded, audioElement!, trackSliderProps.trackPercentage])
}