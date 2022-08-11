import { useAppSelector } from 'hooks/redux'
import styles from './Wall.module.scss'
import { getUploadedPostIds, getPostEntities, getProfileInfo, getPosts, getPostsLoadInfo } from '../../redux/profileReducer';
import PostEditPanel from 'common/PostEditPanel/PostEditPanel';
import { useEffect, useState } from 'react';
import { useScrollOrWindowSize } from '../../../../hooks/useScrollOrWindowSize';
import { useAppDispatch } from '../../../../hooks/redux';
import { ErrorGettingPost } from './ErrorGettingPost';




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
   const postsLoadInfo = useAppSelector(getPostsLoadInfo);
   const resize = useScrollOrWindowSize("resize");
   const scroll = useScrollOrWindowSize("scroll");

   const [allPostCompsHaveBeenLoaded, setAllPostCompsHaveBeenLoaded] = useState<boolean>(false);
   const [postCompLoadingStatuses, setPostCompLoadingStatuses] = useState<PostLoadingStatuses>({});




   const updatePostLoadingStatuses = (id: string, value: boolean): void => {
      // console.log("updatePostLoadingStatuses")

      const loadingStatuses = { ...postCompLoadingStatuses };
      loadingStatuses[id] = value;

      setPostCompLoadingStatuses(loadingStatuses);
   }




   useEffect(() => {
      // console.log("postCompLoadingStatuses: ", postCompLoadingStatuses);
   }, [postCompLoadingStatuses])


   useEffect(() => {
      resize.addEventListener();
      scroll.addEventListener();

      return () => {
         resize.removeEventListener();
         scroll.removeEventListener();
      }
   }, []);


   useEffect(() => {
      // console.log("1", allPostCompsHaveBeenLoaded, profileInfo.posts.length, uploadedPostIds.length)

      if (
         allPostCompsHaveBeenLoaded
         && !postsLoadInfo.loading
         && postsLoadInfo.loaded
         && profileInfo.posts.length > 3
         && uploadedPostIds.length >= 3
         && uploadedPostIds.length < profileInfo.posts.length
      ) {
         let scrollBottom = document.documentElement.scrollHeight - (resize.value[1] + scroll.value[1]);

         // console.log("scrollBottom: ", scrollBottom)

         if (scrollBottom < 200) {
            dispatch(getPosts(
               {
                  allPostIdsLength: profileInfo.posts.length,
                  uploadedPostIdsLength: uploadedPostIds.length,
                  objectId: profileInfo.objectId
               }
            ))

            setAllPostCompsHaveBeenLoaded(false);
         }
      }
   }, [scroll.value[1], postsLoadInfo.loading, postsLoadInfo.loaded, allPostCompsHaveBeenLoaded, uploadedPostIds.length, profileInfo.posts.length])


   // * setPostCompLoadingStatuses
   useEffect(() => {
      if (!postsLoadInfo.loading && postsLoadInfo.loaded) {
         const loadingStatuses: PostLoadingStatuses = { ...postCompLoadingStatuses };

         let i = 0;

         uploadedPostIds.forEach((id => {
            if (loadingStatuses[id] === undefined) {
               loadingStatuses[id] = false;
               i++;
            }
         }))

         if (i > 0) setPostCompLoadingStatuses(loadingStatuses);

         const loadingStatusEqualToFalse = uploadedPostIds.find(id => loadingStatuses[id] === false);

         if (loadingStatusEqualToFalse === undefined) {
            setAllPostCompsHaveBeenLoaded(true);
         } else {
            setAllPostCompsHaveBeenLoaded(false);
         }
      }

   }, [postCompLoadingStatuses, uploadedPostIds.length, postsLoadInfo.loading, postsLoadInfo.loaded])


   useEffect(() => {
      console.log("uploadedPostIds: ", uploadedPostIds)
   }, [uploadedPostIds])



   return !postsLoadInfo.error && uploadedPostIds.length > 0
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
            {
               postsLoadInfo.loading && (
                  <div className={styles.postPreloaderContainer}>
                     <img src='./image/defaultAvatar.jpg' />
                  </div>
               )
            }
         </>
      )
      : postsLoadInfo.error
         ? <ErrorGettingPost />
         : <></>
}




export default Wall