import { useEffect, useState } from "react";
import { PostMode } from "../PostEditPanel";

export const usePostLoadingStatus = (
   mode: PostMode,
   imagesAndVideosLength: number,
   audiosLength: number,
   filesLength: number,
   innerHTML: string,
   audioLoadingStatuses: boolean[],
   numberOfAudioLoadedStatuses: number,
) => {
   const [postCompLoadingStatuses, setPostCompLoadingStatuses] = useState<boolean>();
   



   // useEffect(() => {
   //    if (audioLoadingStatuses.length === numberOfAudioLoadedStatuses)
   //    // console.log("numberOfAudioLoadedStatuses: ", numberOfAudioLoadedStatuses);
   // }, [numberOfAudioLoadedStatuses])




   return {}
}