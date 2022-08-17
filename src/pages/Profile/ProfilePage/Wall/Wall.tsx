import { useAppSelector } from 'hooks/redux'
import styles from './Wall.module.scss'
import { getUploadedPostIds, getPostEntities, getProfileInfo, getPosts, getPostsLoadInfo, profileActions, getProfileInfoMode, getProfilePageScroll } from '../../redux/profileReducer';
import PostEditPanel from 'common/PostEditPanel/PostEditPanel';
import { useContext, useEffect, useRef, useState } from 'react';
import { useScrollOrWindowSize } from '../../../../hooks/useScrollOrWindowSize';
import { useAppDispatch } from '../../../../hooks/redux';
import { ErrorGettingPost } from './ErrorGettingPost';
import { AppContext } from 'App';




type Props = {
}

export type PostLoadingStatuses = {
   [index: string]: boolean
}




const Wall = (props: Props) => {
   const dispatch = useAppDispatch();
   const appContext = useContext(AppContext);
   const profileInfo = useAppSelector(getProfileInfo);
   const profileInfoMode = useAppSelector(getProfileInfoMode);
   const uploadedPostIds = useAppSelector(getUploadedPostIds);
   const postEntities = useAppSelector(getPostEntities);
   const postsLoadInfo = useAppSelector(getPostsLoadInfo);
   const resize = useScrollOrWindowSize("resize");
   const scroll = useScrollOrWindowSize("scroll");
   const profilePageScroll = useAppSelector(getProfilePageScroll);
   const [scrollHasBeenSet, setScrollHasBeenSet] = useState<boolean>(false);

   const [allPostCompsHaveBeenLoaded, setAllPostCompsHaveBeenLoaded] = useState<boolean>(false);

   const postCompLoadingStatuses = useRef<PostLoadingStatuses>({});




   const updatePostLoadingStatuses = (id: string, value: boolean): void => {
      const loadingStatuses = { ...postCompLoadingStatuses.current };
      loadingStatuses[id] = value;
      postCompLoadingStatuses.current = { ...loadingStatuses }


      const loadingStatusEqualToFalse = uploadedPostIds.find(id => loadingStatuses[id] === false);

      if (loadingStatusEqualToFalse === undefined) {
         setAllPostCompsHaveBeenLoaded(true);
      } else {
         setAllPostCompsHaveBeenLoaded(false);
      }
   }




   useEffect(() => {
      if (scrollHasBeenSet && allPostCompsHaveBeenLoaded) {
         appContext.setProfileWallLoading!(false);
      }
   }, [scrollHasBeenSet, allPostCompsHaveBeenLoaded])


   useEffect(() => {
      resize.addEventListener();
      scroll.addEventListener();

      return () => {
         resize.removeEventListener();
         scroll.removeEventListener();
         dispatch(profileActions.setProfileInfoMode("pageView"));
         appContext.setProfileWallLoading!(true);
      }
   }, []);


   useEffect(() => {
      if (allPostCompsHaveBeenLoaded) {
         if (!scrollHasBeenSet) {
            if (profilePageScroll[1] + document.documentElement.clientHeight <= document.documentElement.scrollHeight) {
               document.documentElement.scrollTop = profilePageScroll[1];
               setScrollHasBeenSet(true);

            } else {
               document.documentElement.scrollTop = document.documentElement.scrollHeight - document.documentElement.clientHeight;

               if (uploadedPostIds.length === profileInfo.posts.length) {
                  setScrollHasBeenSet(true);
               }
            }

         } else {
            dispatch(profileActions.setProfilePageScroll(scroll.value));
         }

      }
   }, [
      scroll.value[1],
      allPostCompsHaveBeenLoaded,
      scrollHasBeenSet,
      uploadedPostIds.length,
      profileInfo.posts.length,
      uploadedPostIds.length,
      profileInfo.posts.length
   ])


   useEffect(() => {
      if (
         allPostCompsHaveBeenLoaded
         && profileInfoMode !== 'showingAPopup'
         && !postsLoadInfo.loading
         && postsLoadInfo.loaded
         && profileInfo.posts.length > 3
         && uploadedPostIds.length >= 3
         && uploadedPostIds.length < profileInfo.posts.length
      ) {
         let scrollBottom = document.documentElement.scrollHeight - (resize.value[1] + scroll.value[1]);


         if (scrollBottom < 200) {
            dispatch(getPosts(
               {
                  allPostIdsLength: profileInfo.posts.length,
                  uploadedPostIdsLength: uploadedPostIds.length,
                  objectId: profileInfo.objectId
               }
            ))
         }
      }
   }, [
      scroll.value[1],
      postsLoadInfo.loading,
      postsLoadInfo.loaded,
      allPostCompsHaveBeenLoaded,
      uploadedPostIds.length,
      profileInfo.posts.length,
      profileInfoMode
   ])


   useEffect(() => {
      if (!postsLoadInfo.loading && postsLoadInfo.loaded) {

         const loadingStatuses: PostLoadingStatuses = { ...postCompLoadingStatuses.current };

         let i = 0;

         uploadedPostIds.forEach((id => {
            if (loadingStatuses[id] === undefined) {
               loadingStatuses[id] = false;
               i++;
            }
         }))

         if (i > 0) postCompLoadingStatuses.current = { ...loadingStatuses };
      }
   }, [uploadedPostIds.length, postsLoadInfo.loading, postsLoadInfo.loaded])



   // !
   useEffect(() => {
      console.log("Wall", postsLoadInfo.error, uploadedPostIds.length, uploadedPostIds.length);
   }, [postsLoadInfo.error, uploadedPostIds.length, uploadedPostIds.length])
   // !


   return !postsLoadInfo.error && uploadedPostIds.length > 0 && uploadedPostIds.length
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
                        id={id}
                        updatePostLoadingStatuses={updatePostLoadingStatuses}
                        postCompLoadingStatuses={postCompLoadingStatuses.current}
                     />
                  </div>
               ))
            }
            {
               postsLoadInfo.loading && (
                  <div className={`${styles.preloaderContainer} pagePart`}>
                     <img src='./animatedIcons/preloader2.svg' />
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