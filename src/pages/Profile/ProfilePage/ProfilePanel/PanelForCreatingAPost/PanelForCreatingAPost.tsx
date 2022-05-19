import styles from './PanelForCreatingAPost.module.scss'
import profilePanelStyles from '../ProfilePanel.module.scss'
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Button, RoundAvatar } from 'common';
import { useAppSelector } from 'hooks/redux';
import { getProfileInfo, profileActions } from '../../../redux/profileReducer';
import { AppContext, PopupContext } from 'App';
import AddContentIcon from './AddContentIcon';
import SelectAndEditAnImageForm from 'common/UploadFormsAndLightbox/SelectAndEditAnImageForm';
import { useAppDispatch } from '../../../../../hooks/redux';
import { PostImagesItem, usePostImagesAndVideosBlock } from './hooks/usePostImagesAndVideosBlock';
import { Popup, usePopupElement } from 'hooks';
import VideoUploader from 'common/UploadFormsAndLightbox/VideoUploader';
import ImagesAndVideosBlockContainer from './ImagesAndVideosBlockContainer';
import ImageAndVideoLightbox from 'common/UploadFormsAndLightbox/ImageAndVideoLightbox';



type EditMode = "textEdit" | "imageEdit" | "fileSelection" | "audioSelection" | "videoSelection" | undefined;

type AddContentButtonClickListeners = {
   image: () => void
   file: () => void
   audio: () => void
   video: () => void
   [key: string]: () => void
}

type Props = {
}

type ImagesAndVideosBlockCtxt = {
   setShowVideoAndImageSlider?: React.Dispatch<React.SetStateAction<boolean>>
   setSliderStartIndex?: React.Dispatch<React.SetStateAction<number>>
}

export type AddContentButtonNames = "image" | "file" | "audio" | "video";



const icons: string[] = [
   "./icons/image.svg",
   "./icons/files.svg",
   "./icons/music.svg",
   "./icons/video.svg",
];

const addContentButtonNames: AddContentButtonNames[] = [
   "image",
   "file",
   "audio",
   "video"
];

export let ImagesAndVideosBlockContext = React.createContext<ImagesAndVideosBlockCtxt>({});



const PanelForCreatingAPost = (props: Props) => {
   const dispatch = useAppDispatch();
   const textEditorRef = useRef<HTMLDivElement>(null);
   const profileInfo = useAppSelector(getProfileInfo);
   const [editMode, setEditMode] = useState<EditMode>(undefined);
   const popupContext = useContext(PopupContext);
   const appContext = useContext(AppContext);
   const promptRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const popupPrompt: Popup = usePopupElement(promptRef, false);
   const [contentIconsPromptText, setContentIconsPromptText] = useState<string | undefined>(undefined);
   const [activeContentIcon, setActiveContentIcon] = useState<AddContentButtonNames | undefined>("image");
   const [showVideoAndImageSlider, setShowVideoAndImageSlider] = useState<boolean>(false);
   const [sliderStartIndex, setSliderStartIndex] = useState<number>(0);
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
      containerWidth
   } = usePostImagesAndVideosBlock();



   const finishWatching = (): void => setShowVideoAndImageSlider(false);

   const finishEditing = (): void => setEditMode(undefined);

   const textEditorClickListener = (e: React.MouseEvent): void => {
      setEditMode('textEdit');
   }

   const imageClickListener = (): void => {
      if (imagesAndVideos.length < 10) setEditMode('imageEdit');
   }

   const filesClickListener = (): void => {
      setEditMode('fileSelection');
   }

   const audioClickListener = (): void => {
      setEditMode('audioSelection');
   }

   const videoClickListener = (): void => {
      setEditMode('videoSelection');
   }

   const addContentButtonClickListeners: AddContentButtonClickListeners = {
      image: imageClickListener,
      file: filesClickListener,
      audio: audioClickListener,
      video: videoClickListener,
   }

   const addImageOrVideoSubmitListener = (file: File | null, callback: () => void, type: "image" | "video", sizes: [number, number] | undefined): void => {
      if (file) {
         const imageObj: PostImagesItem = {
            type,
            src: URL.createObjectURL(file),
            file: file,
            aspect: sizes ? (sizes[1] / sizes[0]) : 1,
            area: sizes ? sizes[1] * sizes[0] : 0,
            sizes
         }

         setImagesAndVideos([...imagesAndVideos, imageObj]);
      }

      callback();
   }

   const deleteImageOrVideo = (index: number): void => {
      setImagesAndVideos(imagesAndVideos.filter((item, i) => i !== index));
   }



   useEffect(() => {
      if (editMode === 'imageEdit' || editMode === 'videoSelection' || showVideoAndImageSlider) {
         popupContext.setNeedToShowPopup!(true);
      } else {
         popupContext.setNeedToShowPopup!(false);
      }
   }, [editMode, showVideoAndImageSlider]);


   useEffect(() => {
      if (editMode || showVideoAndImageSlider) {
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
               submitListener={addImageOrVideoSubmitListener}
               uploadUncroppedImage={true}
               uploadButtonText="Add image to post"
               popupText='Add image to post'
            />);
         }
         else if (editMode === 'videoSelection') {
            appContext.setPopup!(<VideoUploader
               finishEditing={finishEditing}
               submitListener={addImageOrVideoSubmitListener}
               uploadButtonText="Add video to post"
               popupText='Add video to post'
            />)
         }
         else {
            appContext.setPopup!(undefined);
         }
      } else {
         console.log("showVideoAndImageSlider: ", showVideoAndImageSlider)

         appContext.setPopup!(
            <ImageAndVideoLightbox
               itemIndex={sliderStartIndex}
               contentArr={imagesAndVideos}
               finishWatching={finishWatching}
            />
         )
      }
   }, [editMode, showVideoAndImageSlider, sliderStartIndex, imagesAndVideos.length]);


   useEffect(() => {
      if (imagesAndVideos.length === 10) {
         if (activeContentIcon === 'image' || activeContentIcon === 'video') {
            setContentIconsPromptText("A post can only have 10 attachments")
         } else {
            setContentIconsPromptText(undefined);
         };
      } else {
         setContentIconsPromptText(undefined);
      };
   }, [imagesAndVideos.length, activeContentIcon]);



   return (
      <div className={`${styles.panelForCreatingAPost} ${profilePanelStyles.panelForCreatingAPost}`} ref={panelRef}>
         <div className={styles.gridContainer}>
            <RoundAvatar
               src={profileInfo.avatar ? profileInfo.avatar : './image/defaultAvatar.jpg'}
               additionalClass={styles.avatar}
            />
            <div
               className={styles.textEditor}
               onClick={textEditorClickListener}
               ref={textEditorRef}
               contentEditable={true}
               placeholder="Anything new?"
            >
            </div>
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
                           containerWidth
                        }
                     }
                  />
               </ImagesAndVideosBlockContext.Provider>
            </div>
            <div className={styles.contentIcons}>
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
                     clickHandler: () => { },
                     changeStyleOnHover: true,
                     containerClassName: styles.createAPostButtonContainer,
                     buttonClassName: styles.createAPostButton
                  }
               }
            />
         </div >
      </div >
   )
}



export default PanelForCreatingAPost