import { getArrayWithUpdatedItemValue } from "functions/getArrayWithUpdatedItemValue";
import { getFilledArray } from "functions/getFiledArray";
import { Post } from "pages/Profile/types/types";
import { useEffect, useState } from "react";
import { PostMode } from "../PostEditPanel";




export type DataType = "image/video" | "file" | "audio"




export const usePostLoadingStatus = (
   mode: PostMode,
   post: Post | undefined,
   updatePostLoadingStatuses: ((id: string, value: boolean) => void) | undefined

) => {


   const [allImagesHaveBeenLoaded, setAllImagesHaveBeenLoaded] = useState<boolean>(false);
   const [imagesLoadingStatuses, setImagesLoadingStatuses] = useState<boolean[]>(getFilledArray(false, post && post.imagesAndVideos ? post.imagesAndVideos.length : 0));

   const [allAudiosHaveBeenLoaded, setAllAudiosHaveBeenLoaded] = useState<boolean>(false);
   const [audiosLoadingStatuses, setAudiosLoadingStatuses] = useState<boolean[]>(getFilledArray(false, post && post.audios ? post.audios.length : 0));

   const [allFilesHaveBeenLoaded, setAllFilesHaveBeenLoaded] = useState<boolean>(false);
   const [filesLoadingStatuses, setFilesLoadingStatuses] = useState<boolean[]>(getFilledArray(false, post && post.files ? post.files.length : 0));

   const [innerHTMLHaveBeenLoaded, setInnerHTMLHaveBeenLoaded] = useState<boolean>(false);




   const updateLoadingStatusesItem = (index: number, newItemValue: boolean, dataType: DataType): void => {
      if (dataType === "image/video") {
         setImagesLoadingStatuses(getArrayWithUpdatedItemValue<boolean>(imagesLoadingStatuses, index, newItemValue));
      } else if (dataType === "audio") {
         setAudiosLoadingStatuses(getArrayWithUpdatedItemValue<boolean>(audiosLoadingStatuses, index, newItemValue));
      } else if (dataType === "file") {
         setFilesLoadingStatuses(getArrayWithUpdatedItemValue<boolean>(filesLoadingStatuses, index, newItemValue));
      }
   }




   useEffect(() => {
      if (mode === "view") return

      if (allImagesHaveBeenLoaded && allAudiosHaveBeenLoaded && allFilesHaveBeenLoaded && innerHTMLHaveBeenLoaded) {
         updatePostLoadingStatuses!(post!.objectId, true)
      }
   }, [mode, allImagesHaveBeenLoaded, allAudiosHaveBeenLoaded, allFilesHaveBeenLoaded, innerHTMLHaveBeenLoaded])


   useEffect(() => {
      if (!imagesLoadingStatuses.includes(false)) {
         setAllImagesHaveBeenLoaded(true)
      }
   }, [imagesLoadingStatuses])


   useEffect(() => {
      console.log("audiosLoadingStatuses: ", audiosLoadingStatuses)

      if (!audiosLoadingStatuses.includes(false)) {
         setAllAudiosHaveBeenLoaded(true)
      }
   }, [audiosLoadingStatuses])


   useEffect(() => {
      if (!filesLoadingStatuses.includes(false)) {
         setAllFilesHaveBeenLoaded(true)
      }
   }, [filesLoadingStatuses])




   if (mode === "view") {
      return {
         setInnerHTMLHaveBeenLoaded,
         updateLoadingStatusesItem
      }
   } else {
      return {
         setInnerHTMLHaveBeenLoaded: undefined,
         updateLoadingStatusesItem: undefined
      }
   }
}