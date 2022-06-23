import { ActionCreatorWithPayload } from "@reduxjs/toolkit";



export const getVolumeSliderChangeListener = (
   audioElement: HTMLAudioElement,
   setVolumePercentage: (volumePercentage: number) => void

) => (volumePercentage: number) => {

   const audio = audioElement!;

   if (audio === null) return

   audio.volume = volumePercentage / 100;
   setVolumePercentage(volumePercentage);
}