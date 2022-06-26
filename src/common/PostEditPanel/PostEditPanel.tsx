import styles from './PostEditPanel.module.scss';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Button, RoundAvatar } from 'common';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { getProfileInfo, profileActions, createAPost, getLoadInfo, getProfileInfoMode, getPostIds } from 'pages/Profile/redux/profileReducer';
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
import { useWindowSize } from 'hooks/useWindowSize';
import { AudioFile } from 'common/AudioPlayer/types/types';
import { useFilesBlock } from './hooks/useFilesBlock';
import { useAudioBlock } from './hooks/useAudioBlock';
import TextEditor from 'common/TextEditor/TextEditor';




type EditMode = "textEdit" | "imageEdit" | "fileSelection" | "audioSelection" | "videoSelection" | undefined;

type AddContentButtonClickListeners = {
   image: () => void
   file: () => void
   audio: () => void
   video: () => void
   [key: string]: () => void
}

type Props = {
   containerClassName: string
}

type ImagesAndVideosBlockCtxt = {
   setShowVideoAndImageSlider?: React.Dispatch<React.SetStateAction<boolean>>
   setSliderStartIndex?: React.Dispatch<React.SetStateAction<number>>
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
]

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
   const postIds = useAppSelector(getPostIds);

   const resize = useWindowSize("resize");
   const [editMode, setEditMode] = useState<EditMode>(undefined);
   const popupContext = useContext(PopupContext);
   const appContext = useContext(AppContext);
   const promptRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const popupPrompt: Popup = usePopupElement(promptRef, false);
   const [contentIconsPromptText, setContentIconsPromptText] = useState<string | undefined>(undefined);
   const [activeContentIcon, setActiveContentIcon] = useState<AddContentButtonNames | undefined>("image");
   const [showVideoAndImageSlider, setShowVideoAndImageSlider] = useState<boolean>(false);
   const [sliderStartIndex, setSliderStartIndex] = useState<number>(0);
   const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);
   const [textEditorInnerHTML, setTextEditorInnerHTML] = useState<string | undefined>(undefined);
   const [postIsLoading, setPostIsLoading] = useState<boolean>(false);
   const [postIsBeingCreated, setPostIsBeingCreated] = useState<boolean>(false);
   const [resetInnerHTML, setResetInnerHTML] = useState<boolean>(false);

   const {
      imagesAndVideos,
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
      filesBlockStyle,
      addFile,
      deleteFile,
      resetFilesBlock

   } = useFilesBlock();


   const {
      audioIds,
      audios,
      audioFiles,
      audiosBlockStyle,
      audioPlayerState,
      audioPlayerStateAPI,
      audioLoadingStatuses,
      numberOfAudioLoadedStatuses,
      setShowAudioPlayer,
      updateLoadingStatusesItem,
      addAudio,
      deleteAudio,
      resetAudios

   } = useAudioBlock(appContext, resize);




   const finishWatching = (): void => setShowVideoAndImageSlider(false);


   const finishEditing = (): void => setEditMode(undefined);


   const textEditorClickListener = (e: React.MouseEvent): void => {
      setEditMode('textEdit');
   }


   const imageClickListener = (): void => {
      if (!contentIconsPromptText) setEditMode('imageEdit');
   }


   const filesClickListener = (): void => {
      if (!contentIconsPromptText) setEditMode('fileSelection');
   }


   const audioClickListener = (): void => {
      if (!contentIconsPromptText) setEditMode('audioSelection');
   }


   const videoClickListener = (): void => {
      if (!contentIconsPromptText) setEditMode('videoSelection');
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

      dispatch(profileActions.setProfileInfoMode('addContent'));

      dispatch(createAPost({
         profileId: profile.objectId,
         // profilePosts: profile.posts,
         profilePosts: postIds,
         innerHTML: textEditorInnerHTML ? textEditorInnerHTML : "",
         files: files.map(item => item.file),
         audios: [...audioFiles],
         imagesAndVideos: imagesAndVideos.map(item => item.file)
      }))
   }


   const buttonPreloader = (): JSX.Element | undefined => postIsLoading
      ? <img className={styles.buttonPreloader} src='./animatedIcons/buttonPreloader_white.svg' alt="button preloader" />
      : undefined;




   useEffect(() => {
      if (!loadInfo.loading && profileInfoMode === 'view') {
         if (postIsBeingCreated) {
            resetImagesBlock();
            resetFilesBlock();
            resetAudios();
            setResetInnerHTML(true);

            setPostIsBeingCreated(false);
         }

         setPostIsLoading(false);
      }
   }, [loadInfo.loading, profileInfoMode, postIsBeingCreated])


   useEffect(() => {
      if (imagesAndVideos.length + audioIds.length > 0) {
         resize.removeEventListener();
         resize.addEventListener();
      } else {
         resize.removeEventListener();
      }
   }, [imagesAndVideos.length, files.length, audioIds.length])


   useEffect(() => {
      if ((editMode && editMode !== 'textEdit') || showVideoAndImageSlider) {
         popupContext.setNeedToShowPopup!(true);
      } else {
         popupContext.setNeedToShowPopup!(false);
      }
   }, [editMode, showVideoAndImageSlider]);


   useEffect(() => {
      if ((editMode || showVideoAndImageSlider) && editMode !== 'textEdit') {
         dispatch(profileActions.setProfileInfoMode("edit"));
      }

      return () => {
         dispatch(profileActions.setProfileInfoMode("view"));
      }
   }, [editMode, showVideoAndImageSlider]);


   useEffect(() => {
      if (!showVideoAndImageSlider) {
         if (editMode === 'imageEdit') {
            appContext.setPopup!(<SelectAndEditAnImageForm
               finishEditing={finishEditing}
               imageAspect={undefined}
               submitListener={addImageOrVideo}
               uploadUncroppedImage={true}
               uploadButtonText="Add image to post"
               popupText='Add image to post'
            />);
         } else if (editMode === 'videoSelection') {
            appContext.setPopup!(<VideoUploader
               finishEditing={finishEditing}
               submitListener={addImageOrVideo}
               uploadButtonText="Add video to post"
               popupText='Add video to post'
            />);
         } else if (editMode === 'fileSelection') {
            appContext.setPopup!(<FileUploader
               finishEditing={finishEditing}
               submitListener={addFile}
               uploadButtonText="Add file to post"
               popupText='Add file to post'
            />);
         } else if (editMode === 'audioSelection') {
            appContext.setPopup!(<AudioUploader
               finishEditing={finishEditing}
               submitListener={addAudio}
               uploadButtonText="Add audio to post"
               popupText='Add audio to post'
               setOtherAudioIsPlaying={() => audioPlayerStateAPI.setIsPlaying(false)}
            />);
         } else {
            appContext.setPopup!(undefined);
         }
      } else {
         appContext.setPopup!(<ImageAndVideoLightbox
            itemIndex={sliderStartIndex}
            contentArr={imagesAndVideos}
            finishWatching={finishWatching}
         />);
      }
   }, [editMode, showVideoAndImageSlider, sliderStartIndex, imagesAndVideos.length]);


   useEffect(() => {
      if (imagesAndVideos.length + files.length + audioIds.length === 10) {
         setContentIconsPromptText("A post can only have 10 attachments");
      } else {
         setContentIconsPromptText(undefined);
      };
   }, [imagesAndVideos.length, files.length, audioIds.length, activeContentIcon]);




   return (
      <div className={`${styles.panelForCreatingAPost} ${props.containerClassName}`} ref={panelRef}>
         {
            iconsLoaded ?
               (
                  <div className={styles.gridContainer}>
                     <RoundAvatar
                        src={profile.avatar ? profile.avatar : './image/defaultAvatar.jpg'}
                        additionalClass={styles.avatar}
                     />
                     <TextEditor
                        setTextEditorInnerHTML={setTextEditorInnerHTML}
                        textEditorClickListener={textEditorClickListener}
                        containerClassName={styles.textEditorContainer}
                        resetInnerHTML={resetInnerHTML}
                        setResetInnerHTML={setResetInnerHTML}
                     />
                     <div className={styles.imagesBlock} style={imagesAndVideosBlockStyle}>
                        <ImagesAndVideosBlockContext.Provider value={{ setShowVideoAndImageSlider, setSliderStartIndex }}>
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
                                 file={item}
                                 deleteFile={deleteFile}
                                 index={index}
                              />
                           )
                        }
                     </div>
                     <div className={styles.audiosBlock} style={audiosBlockStyle}>
                        {
                           audioIds.map((id, index) =>
                              <AudiosListItem
                                 key={id}
                                 index={index}
                                 id={id}
                                 file={audios[id]}
                                 deleteAudio={deleteAudio}
                                 activeTrackId={audioPlayerState.activeTrackId}
                                 setActiveTrackId={audioPlayerStateAPI.setActiveTrackId}
                                 audioIsPlaying={audioPlayerState.isPlaying}
                                 setAudioIsPlaying={audioPlayerStateAPI.setIsPlaying}
                                 setShowAudioPlayer={setShowAudioPlayer}
                                 setActiveTrack={audioPlayerStateAPI.setActiveTrackId}
                                 loadingStatus={audioLoadingStatuses[index]}
                                 updateLoadingStatusesItem={updateLoadingStatusesItem}
                                 numberOfLoadedStatuses={numberOfAudioLoadedStatuses}
                              />
                           )
                        }
                     </div>
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