import { useAppSelector } from 'hooks/redux'
import styles from './Wall.module.scss'
import { getUploadedPostIds, getPostEntities, getProfileInfo, getPosts } from '../../redux/profileReducer';
import PostEditPanel from 'common/PostEditPanel/PostEditPanel';
import { useEffect, useState } from 'react';
import { useScrollOrWindowSize } from '../../../../hooks/useScrollOrWindowSize';
import { useAppDispatch } from '../../../../hooks/redux';




type Props = {
}

type PostLoadingStatuses = {
   [index: string]: boolean
}




const Wall = (props: Props) => {
   const dispatch = useAppDispatch();
   const profileInfo = useAppSelector(getProfileInfo);
   const uploadedPostIds = useAppSelector(getUploadedPostIds);
   const postEntities = useAppSelector(getPostEntities);
   const resize = useScrollOrWindowSize("resize");
   const scroll = useScrollOrWindowSize("scroll");

   const [allPostCompsHaveBeenLoaded, setAllPostCompsHaveBeenLoaded] = useState<boolean>(false);
   const [postCompLoadingStatuses, setPostCompLoadingStatuses] = useState<PostLoadingStatuses>({});




   const updatePostLoadingStatuses = (id: string, value: boolean): void => {
      const loadingStatuses = { ...postCompLoadingStatuses };
      loadingStatuses[id] = value;

      setPostCompLoadingStatuses(loadingStatuses);
   }




   // * setPostCompLoadingStatuses
   useEffect(() => {
      const loadingStatuses: PostLoadingStatuses = {}

      uploadedPostIds.forEach((id => {
         if (loadingStatuses[id] === undefined) {
            loadingStatuses[id] = false
         }
      }))

      setPostCompLoadingStatuses(loadingStatuses)

   }, [uploadedPostIds.length])


   // * setAllPostCompsHaveBeenLoaded
   useEffect(() => {
      console.log(Object.keys(postCompLoadingStatuses).length, uploadedPostIds.length);

      if (Object.keys(postCompLoadingStatuses).length === uploadedPostIds.length) {
         const loadingStatusEqualToFalse = uploadedPostIds.find(id => postCompLoadingStatuses[id] === false);


         if (loadingStatusEqualToFalse === undefined) {
            setAllPostCompsHaveBeenLoaded(true);
         } else {
            setAllPostCompsHaveBeenLoaded(false);
         }

      } else if (Object.keys(postCompLoadingStatuses).length < uploadedPostIds.length) {
         setAllPostCompsHaveBeenLoaded(false);
      }

   }, [postCompLoadingStatuses, uploadedPostIds.length])


   useEffect(() => {
      resize.addEventListener();
      scroll.addEventListener();

      return () => {
         resize.removeEventListener();
         scroll.removeEventListener();
      }
   }, []);


   // * запрос на получение новых постов getPosts
   useEffect(() => {
      console.log("allPostCompsHaveBeenLoaded: ", allPostCompsHaveBeenLoaded, uploadedPostIds.length)

      const allPostIdsLength = profileInfo.posts.length;
      const uploadedPostIdsLength = uploadedPostIds.length;


      if (
         !allPostCompsHaveBeenLoaded
         || uploadedPostIdsLength < 3
         || uploadedPostIdsLength === allPostIdsLength
         || Object.keys(postCompLoadingStatuses).length !== uploadedPostIdsLength
      ) return;


      console.log("getPosts call")


      let scrollBottom = document.documentElement.scrollHeight - (resize.value[1] + scroll.value[1]);

      console.log("scrollBottom: ", scrollBottom)

      if (scrollBottom < 200) {
         dispatch(getPosts(
            {
               allPostIdsLength,
               uploadedPostIdsLength,
               objectId: profileInfo.objectId
            }
         ))

         setAllPostCompsHaveBeenLoaded(false);
      }

   }, [
      resize.value,
      scroll.value,
      uploadedPostIds.length,
      profileInfo.posts.length,
      profileInfo.objectId,
      allPostCompsHaveBeenLoaded,
      postCompLoadingStatuses
   ])




   return uploadedPostIds.length > 0
      ? (
         <>
            {
               uploadedPostIds.map((id, index) => (
                  <div key={id} className={`${styles.postContainer} pagePart`}>
                     <PostEditPanel
                        mode='view'
                        postIndex={index}
                        containerClassName={styles.post}
                        post={postEntities[id]}
                        audioPlayerContext={`post_${id}`}
                        id={id}
                        updatePostLoadingStatuses={updatePostLoadingStatuses}
                     />
                  </div>
               ))
            }
         </>
      )
      : <></>
}




export default Wall