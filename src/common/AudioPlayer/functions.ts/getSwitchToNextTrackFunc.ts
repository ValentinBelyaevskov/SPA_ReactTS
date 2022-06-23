export const getSwitchToNextTrackFunc = (
   setActiveTrackId: (id: number) => void,
   setIsPlaying: (isPlaying: boolean) => void

) => (currentId: number, audioFileIds: number[]): void => {

   const currentIdNumber = audioFileIds.findIndex(id => id === currentId);


   if (audioFileIds.length === 1) return;

   if (currentIdNumber < audioFileIds.length - 1) {
      setActiveTrackId(audioFileIds[currentIdNumber + 1]);
      setIsPlaying(true);
   } else {
      setActiveTrackId(audioFileIds[0]);
      setIsPlaying(false);
   }
}