import { useEffect } from "react";
import { CommonVolumeSliderProps, PlayerState } from "../types/types";




export const useVolumeSlider = (
   state: PlayerState,
   audioElement: HTMLAudioElement,
   commonVolumeSliderProps: CommonVolumeSliderProps,
   setCommonVolumeSliderProps: (props: CommonVolumeSliderProps) => void
) => {
   useEffect(() => {
      if (state.audioUploaded && audioElement) {
         const audio = audioElement!;


         if (commonVolumeSliderProps.soundTogglerValue) {
            audio.muted = false;
         } else {
            // * 2

            audio.muted = true;
         }
      }
   }, [audioElement, state.audioUploaded, commonVolumeSliderProps.soundTogglerValue])


   useEffect(() => {
      if (audioElement && state.audioUploaded) {
         const audio = audioElement;

         if (
            commonVolumeSliderProps.prevVolumePercentage === undefined
            && !commonVolumeSliderProps.soundTogglerValue
         ) {
            audio.volume = 0;

            setCommonVolumeSliderProps({
               ...commonVolumeSliderProps,
               prevVolumePercentage: commonVolumeSliderProps.volumePercentage,
               volumePercentage: 0,
            })

         } else if (
            commonVolumeSliderProps.prevVolumePercentage === undefined
            && commonVolumeSliderProps.soundTogglerValue
            && commonVolumeSliderProps.volumePercentage === 0
         ) {
            audio.volume = 0;

            setCommonVolumeSliderProps({
               prevVolumePercentage: commonVolumeSliderProps.volumePercentage,
               volumePercentage: 0,
               soundTogglerValue: false,
            })

         } else if (
            !commonVolumeSliderProps.soundTogglerValue
            && commonVolumeSliderProps.volumePercentage > 0
         ) {
            setCommonVolumeSliderProps({
               ...commonVolumeSliderProps,
               prevVolumePercentage: undefined,
               soundTogglerValue: true,
            })
         }
      }
   }, [
      commonVolumeSliderProps.soundTogglerValue,
      commonVolumeSliderProps.prevVolumePercentage,
      commonVolumeSliderProps.volumePercentage,
      audioElement,
      state.audioUploaded
   ])


   useEffect(() => {
      if (audioElement && state.audioUploaded) {
         const audio = audioElement;

         if (
            commonVolumeSliderProps.prevVolumePercentage !== undefined
            && commonVolumeSliderProps.soundTogglerValue
         ) {

            audio.volume = commonVolumeSliderProps.prevVolumePercentage / 100;

            setCommonVolumeSliderProps({
               ...commonVolumeSliderProps,
               prevVolumePercentage: undefined,
               volumePercentage: commonVolumeSliderProps.prevVolumePercentage,
            })
         }
      }
   }, [
      audioElement,
      commonVolumeSliderProps.soundTogglerValue,
      commonVolumeSliderProps.prevVolumePercentage,
      state.audioUploaded
   ])
}