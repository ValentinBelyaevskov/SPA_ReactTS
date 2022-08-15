import styles from './PostEditPanel.module.scss';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Button, RoundAvatar } from 'common';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { getProfileInfo, profileActions, createAPost, getLoadInfo, getProfileInfoMode, getUploadedPostIds, getPostsLoadInfo } from 'pages/Profile/redux/profileReducer';
import { AppContext, PopupContext } from 'App';
import AddContentIcon from './AddContentIcon';
import SelectAndEditAnImageForm from 'common/UploadFormsAndLightbox/SelectAndEditAnImageForm';
import { usePostImagesAndVideosBlock } from './hooks/usePostImagesAndVideosBlock';
import { Popup, usePopupElement } from 'hooks';
import VideoUploader from 'common/UploadFormsAndLightbox/VideoUploader';
import ImagesAndVideosBlockContainer from './ImagesAndVideosBlockContainer';
import ImageAndVideoLightbox from 'common/UploadFormsAndLightbox/ImageAndVideoLightbox';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import FileUploader from 'common/UploadFormsAndLightbox/FileUploader';
import FilesListItem from './FilesListItem';
import AudiosListItem from './AudiosListItem';
import AudioUploader from 'common/UploadFormsAndLightbox/AudioUploader';
import { useScrollOrWindowSize } from 'hooks/useScrollOrWindowSize';
import { AudioFile } from 'common/AudioPlayer/types/types';
import { useFilesBlock } from './hooks/useFilesBlock';
import { useAudiosBlock } from './hooks/useAudiosBlock';
import TextEditor from 'common/TextEditor/TextEditor';
import { Post } from 'pages/Profile/types/types';
import getFormattedDate from 'functions/createCivilDate/getFormattedDate';
import { InnerHTML } from './InnerHTML';
import { DataType, usePostLoadingStatus } from './hooks/usePostLoadingStatus';
import { PostLoadingStatuses } from 'pages/Profile/ProfilePage/Wall/Wall';




type PopupType = "textEdit" | "imageEdit" | "fileSelection" | "audioSelection" | "videoSelection" | "showImageAndVideoSlider" | undefined;

export type PostMode = "edit" | "view"

type AddContentButtonClickListeners = {
   image: () => void
   file: () => void
   audio: () => void
   video: () => void
   [key: string]: () => void
}

type Props = {
   postIndex?: number
   containerClassName: string
   mode: PostMode
   post?: Post
   id?: string
   updatePostLoadingStatuses?: (id: string, value: boolean) => void
   postCompLoadingStatuses?: PostLoadingStatuses
}

type ImagesAndVideosBlockCtxt = {
   setPopupType?: React.Dispatch<React.SetStateAction<PopupType>>
   setSliderStartIndex?: React.Dispatch<React.SetStateAction<number>>
   mode?: PostMode
   updateLoadingStatusesItem?: (index: number, newItemValue: boolean, dataType: DataType) => void
}




export type Audios = {
   [key: number]: AudioFile
}

export type AddContentButtonNames = "image" | "file" | "audio" | "video";




export const icons: string[] = [
   "./icons/image.svg",
   "./icons/files.svg",
   "./icons/music.svg",
   "./icons/video.svg",
];

const iconsThatAreLoaded: string[] = [
   "./icons/image.svg",
   "./icons/files.svg",
   "./icons/music.svg",
   "./icons/video.svg",
   "./icons/hideMiniWhite.svg",
   "./icons/hideMini.svg",
   "./icons/playTheme.svg",
   "./icons/pauseTheme.svg",
   './icons/playCircleTheme.svg',
   './icons/pauseCircleTheme.svg',
   "./animatedIcons/preloader2.svg"
];

export const addContentButtonNames: AddContentButtonNames[] = [
   "image",
   "file",
   "audio",
   "video"
];

export let ImagesAndVideosBlockContext = React.createContext<ImagesAndVideosBlockCtxt>({});




const PostEditPanel = (props: Props) => {
   const dispatch = useAppDispatch();
   const profile = useAppSelector(getProfileInfo);
   const loadInfo = useAppSelector(getLoadInfo);
   const profileInfoMode = useAppSelector(getProfileInfoMode);

   const resize = useScrollOrWindowSize("resize");
   const [popupType, setPopupType] = useState<PopupType>(undefined);
   const popupContext = useContext(PopupContext);
   const appContext = useContext(AppContext);
   const promptRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const popupPrompt: Popup = usePopupElement(promptRef, false);
   const [contentIconsPromptText, setContentIconsPromptText] = useState<string | undefined>(undefined);
   const [activeContentIcon, setActiveContentIcon] = useState<AddContentButtonNames | undefined>("image");
   const [sliderStartIndex, setSliderStartIndex] = useState<number>(0);
   const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);
   const [textEditorInnerHTML, setTextEditorInnerHTML] = useState<string | undefined>(undefined);
   const [postIsLoading, setPostIsLoading] = useState<boolean>(false);
   const [postIsBeingCreated, setPostIsBeingCreated] = useState<boolean>(false);
   const [resetInnerHTML, setResetInnerHTML] = useState<boolean>(false);


   const {
      imagesAndVideos,
      setImagesAndVideos,
      imagesAndVideosBlockStyle,
      gridDirection,
      imagesAndVideosContainerStyle,
      firstSubContainerStyle,
      secondSubContainerStyle,
      thirdSubContainerStyle,
      panelRef,
      containerSizes,
      addImageOrVideo,
      deleteImageOrVideo,
      resetImagesBlock

   } = usePostImagesAndVideosBlock(resize);


   const {
      files,
      setFiles,
      filesBlockStyle,
      addFile,
      deleteFile,
      resetFilesBlock

   } = useFilesBlock();


   const {
      stopAudio,
      audioFiles,
      currentPlaylistActive,
      setActiveTrackIdNumber,
      activeTrackIdNumber,
      audiosBlockStyle,
      audioPlayerState,
      audioPlayerStateAPI,
      audioLoadingStatuses,
      numberOfAudioLoadedStatuses,
      setShowAudioPlayer,
      updateAudioLoadingStatusesItem,
      addAudio,
      deleteAudio,
      resetAudios,
      generalAudioPlayerContext,
      setGeneralPlayerContext,
      setCurrentPostPlayerIsActive,

   } = useAudiosBlock(appContext, resize, props.id ? props.id : 'createAPost', props.mode, props.post);


   const {
      setInnerHTMLHaveBeenLoaded,
      updateLoadingStatusesItem

   } = usePostLoadingStatus(
      props.mode,
      props.post,
      props.updatePostLoadingStatuses
   )


   const finishShowingThePopup = (): void => {
      setPopupType(undefined);
      dispatch(profileActions.setProfileInfoMode("pageView"));
   }


   const textEditorClickListener = (e: React.MouseEvent): void => {
      setPopupType('textEdit');
   }


   const imageClickListener = (): void => {
      if (!contentIconsPromptText) setPopupType('imageEdit');
   }


   const filesClickListener = (): void => {
      if (!contentIconsPromptText) setPopupType('fileSelection');
   }


   const audioClickListener = (): void => {
      if (!contentIconsPromptText) setPopupType('audioSelection');
   }


   const videoClickListener = (): void => {
      if (!contentIconsPromptText) setPopupType('videoSelection');
   }


   const addContentButtonClickListeners: AddContentButtonClickListeners = {
      image: imageClickListener,
      file: filesClickListener,
      audio: audioClickListener,
      video: videoClickListener,
   }


   const postButtonClickHandler = () => {
      setPostIsLoading(true);
      setPostIsBeingCreated(true);

      dispatch(profileActions.setProfileInfoMode('addingContent'));

      dispatch(createAPost({
         profileId: profile.objectId,
         profilePosts: profile.posts,
         innerHTML: textEditorInnerHTML ? textEditorInnerHTML : "",
         files: [...files],
         audios: [...audioFiles],
         imagesAndVideos: [...imagesAndVideos]
      }))
   }


   const buttonPreloader = (): JSX.Element | undefined => postIsLoading
      ? <img className={styles.buttonPreloader} src='./animatedIcons/buttonPreloader_white.svg' alt="button preloader" />
      : undefined;




   useEffect(() => {
      if (props.mode === 'view') {
         setImagesAndVideos(props.post!.imagesAndVideos!);
         setFiles(props.post!.files!);
      }
   }, [props.mode])


   useEffect(() => {
      if (!loadInfo.loading && profileInfoMode === 'pageView' && props.mode === 'edit') {
         if (postIsBeingCreated) {
            resetImagesBlock();
            resetFilesBlock();

            if (generalAudioPlayerContext === undefined) resetAudios();

            setResetInnerHTML(true);

            setPostIsBeingCreated(false);
         }

         setPostIsLoading(false);
      }
   }, [loadInfo.loading, profileInfoMode, postIsBeingCreated, props.mode, props.postIndex, generalAudioPlayerContext])


   useEffect(() => {
      if (imagesAndVideos.length + audioFiles.length > 0) {
         resize.removeEventListener();
         resize.addEventListener();
      } else {
         resize.removeEventListener();
      }
   }, [imagesAndVideos.length, files.length, audioFiles.length])


   useEffect(() => {
      if (popupType && popupType !== 'textEdit') {
         popupContext.setPopupName!(props.mode === 'edit' ? "newPost" : props.post!.objectId);

      } else if (
         (props.mode === 'edit' && popupContext.popupName === "newPost")
         || (props.mode === 'view' && popupContext.popupName === props.post!.objectId)
      ) {
         popupContext.setPopupName!(undefined);
      }
   }, [popupType, props.mode, props.post, popupContext.popupName, props.postIndex]);


   useEffect(() => {
      if (popupType && popupType !== 'textEdit') {
         dispatch(profileActions.setProfileInfoMode("showingAPopup"));
      }
   }, [popupType]);


   useEffect(() => {
      if (popupType === 'imageEdit') {
         popupContext.setPopup!(<SelectAndEditAnImageForm
            finishShowingThePopup={finishShowingThePopup}
            imageAspect={undefined}
            submitListener={addImageOrVideo}
            uploadUncroppedImage={true}
            uploadButtonText="Add image to post"
            popupText='Add image to post'
         />);
      } else if (popupType === 'videoSelection') {
         popupContext.setPopup!(<VideoUploader
            finishShowingThePopup={finishShowingThePopup}
            submitListener={addImageOrVideo}
            uploadButtonText="Add video to post"
            popupText='Add video to post'
            playVideoListener={stopAudio}
         />);
      } else if (popupType === 'fileSelection') {
         popupContext.setPopup!(<FileUploader
            finishShowingThePopup={finishShowingThePopup}
            submitListener={addFile}
            uploadButtonText="Add file to post"
            popupText='Add file to post'
         />);
      } else if (popupType === 'audioSelection') {
         popupContext.setPopup!(<AudioUploader
            finishShowingThePopup={finishShowingThePopup}
            submitListener={addAudio}
            uploadButtonText="Add audio to post"
            popupText='Add audio to post'
            setOtherAudioIsPlaying={() => audioPlayerStateAPI.setIsPlaying(false)}
         />);
      } else if (popupType === "showImageAndVideoSlider") {
         popupContext.setPopup!(<ImageAndVideoLightbox
            itemIndex={sliderStartIndex}
            contentArr={imagesAndVideos}
            finishShowingThePopup={finishShowingThePopup}
            playVideoListener={stopAudio}
         />);
      } else if (
         popupType == undefined
         && (
            (props.mode === 'edit' && popupContext.popupName === "newPost")
            || (props.mode === 'view' && popupContext.popupName === props.post!.objectId)
         )
      ) {
         popupContext.setPopup!(undefined);
      }
   }, [popupType, sliderStartIndex, imagesAndVideos.length, props.mode, props.post, popupContext.popupName]);


   useEffect(() => {
      if (imagesAndVideos.length + files.length + audioFiles.length === 10) {
         setContentIconsPromptText("A post can only have 10 attachments");
      } else {
         setContentIconsPromptText(undefined);
      };
   }, [imagesAndVideos.length, files.length, audioFiles.length, activeContentIcon]);




   return (
      <div className={`${styles.panelForCreatingAPost} ${props.containerClassName}`} ref={panelRef}>
         {
            iconsLoaded ?
               (
                  <div className={`${styles.gridContainer} ${styles[props.mode]}`}>
                     <RoundAvatar
                        src={profile.avatar ? profile.avatar : './image/defaultAvatar.jpg'}
                        additionalClass={styles.avatar}
                     />
                     {
                        props.mode === 'edit'
                           ?
                           <>
                              <div className={`${styles.contentIcons} unselectable`}>
                                 {
                                    popupPrompt.needToShowElement && contentIconsPromptText
                                       ? <div className={styles.contentIconsPrompt} ref={promptRef}>
                                          {contentIconsPromptText}
                                       </div>
                                       : null
                                 }
                                 {icons.map((icon, index) => (
                                    <AddContentIcon
                                       key={icon}
                                       icon={icon}
                                       addContentButtonName={addContentButtonNames[index]}
                                       addContentButtonClickListener={addContentButtonClickListeners[addContentButtonNames[index]]}
                                       setActiveContentIcon={setActiveContentIcon}
                                       popupPrompt={popupPrompt}
                                    />
                                 ))}
                              </div>
                              <Button
                                 params={
                                    {
                                       text: "Post",
                                       clickHandler: postButtonClickHandler,
                                       changeStyleOnHover: true,
                                       containerClassName: styles.createAPostButtonContainer,
                                       buttonClassName: styles.createAPostButton,
                                       jsx: buttonPreloader(),
                                       buttonStyle: postIsLoading ? {
                                          color: "rgba(0, 0, 0, 0)"
                                       } : undefined
                                    }
                                 }
                              />
                           </>
                           : props.mode === 'view'
                              ?
                              <>
                                 <div className={styles.userName}>
                                    {`${profile.firstName} ${profile.lastName}`}
                                 </div>
                                 <div className={styles.date}>
                                    {getFormattedDate(props.post!.created, "posts")}
                                 </div>
                              </>
                              : null
                     }
                     {
                        props.mode === 'edit'
                           ?
                           <TextEditor
                              setTextEditorInnerHTML={setTextEditorInnerHTML}
                              textEditorClickListener={textEditorClickListener}
                              containerClassName={styles.textEditorContainer}
                              resetInnerHTML={resetInnerHTML}
                              setResetInnerHTML={setResetInnerHTML}
                           />
                           : props.mode === 'view' && props.post && props.post.innerHTML
                              ?
                              <InnerHTML innerHTML={props.post.innerHTML} setInnerHTMLHaveBeenLoaded={setInnerHTMLHaveBeenLoaded} />
                              : undefined
                     }
                     <div className={styles.imagesBlock} style={imagesAndVideosBlockStyle}>
                        <ImagesAndVideosBlockContext.Provider
                           value={
                              {
                                 setPopupType,
                                 setSliderStartIndex,
                                 mode: props.mode,
                                 updateLoadingStatusesItem
                              }
                           }
                        >
                           <ImagesAndVideosBlockContainer
                              config={
                                 {
                                    deleteImageOrVideo,
                                    gridDirection,
                                    imagesAndVideos: imagesAndVideos,
                                    imagesAndVideosContainerStyle,
                                    fiveOrMoreItems: imagesAndVideos.length < 5 ? false : true,
                                    subContainerStyles: {
                                       firstSubContainerStyle,
                                       secondSubContainerStyle,
                                       thirdSubContainerStyle
                                    },
                                    containerSizes
                                 }
                              }
                           />
                        </ImagesAndVideosBlockContext.Provider>
                     </div>
                     <div className={styles.filesBlock} style={filesBlockStyle}>
                        {
                           files.map((item, index) =>
                              <FilesListItem
                                 key={item.src}
                                 mode={props.mode}
                                 file={item}
                                 deleteFile={deleteFile}
                                 index={index}
                                 updateLoadingStatusesItem={updateLoadingStatusesItem}
                              />
                           )
                        }
                     </div>
                     <div className={styles.audiosBlock} style={audiosBlockStyle}>
                        {
                           audioFiles.map((item, index) =>
                              <AudiosListItem
                                 key={item.id}
                                 index={index}
                                 mode={props.mode}
                                 file={item}
                                 currentPlaylistActive={currentPlaylistActive}
                                 deleteAudio={deleteAudio}
                                 activeTrackIdNumber={activeTrackIdNumber}
                                 audioIsPlaying={audioPlayerState.isPlaying}
                                 setAudioIsPlaying={audioPlayerStateAPI.setIsPlaying}
                                 setShowAudioPlayer={setShowAudioPlayer}
                                 setActiveTrackIdNumber={setActiveTrackIdNumber}
                                 loadingStatus={audioLoadingStatuses[index]}
                                 updateAudioLoadingStatusesItem={updateAudioLoadingStatusesItem}
                                 numberOfLoadedStatuses={numberOfAudioLoadedStatuses}
                                 setGeneralPlayerContext={setGeneralPlayerContext}
                                 updateLoadingStatusesItem={updateLoadingStatusesItem}
                              />
                           )
                        }
                     </div>
                  </div >
               )
               : null
         }
         <IconsThatAreLoaded
            icons={iconsThatAreLoaded}
            setIconsLoaded={setIconsLoaded}
         />
      </div >
   )
}




export default PostEditPanel