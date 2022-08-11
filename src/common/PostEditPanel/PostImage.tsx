import { CustomImage } from "common"
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames"
import styles from './ImagesAndVideosBlockContainer.module.scss'
import { useEffect, useState, useRef } from 'react';
import { GridDirection } from "./hooks/usePostImagesAndVideosBlock";
import { ImagesAndVideosBlockContext } from './PostEditPanel';
import { useContext } from 'react';



type Props = {
   src: string
   index: number
   deleteImageOrVideo: (index: number) => void
   type: "image" | "video"
   sizes: [number, number]
   arrLength: number
   containerSizes: [number, number]
   gridDirection: GridDirection
}

type IframeStyle = {
   width?: string
   height?: string
}

type ImageContainerStyle = {
   width?: string
   height?: string
}



const PostImage = (props: Props) => {
   const contentRef = useRef<HTMLDivElement>(null);
   const context = useContext(ImagesAndVideosBlockContext);
   const [playIconClassName, setPlayIconClassName] = useState<string>(styles.playIcon);
   const hideIconHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const playIconHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const iframeRef = useRef<HTMLIFrameElement>(null);
   const [iframeStyle, setIframeStyle] = useState<IframeStyle>({});
   const [imageContainerStyle, setImageContainerStyle] = useState<ImageContainerStyle>({});
   const imagesAndVideosBlockContext = useContext(ImagesAndVideosBlockContext);




   const imageAndVideoClickHandler = (): void => {
      playIconHoverAndTouchClassNames.clickListener();
      imagesAndVideosBlockContext.setShowVideoAndImageSlider!(true);
      imagesAndVideosBlockContext.setSliderStartIndex!(props.index);
   }

   const deleteImageOrVideo = (): void => {
      hideIconHoverAndTouchClassNames.clickListener();
      props.deleteImageOrVideo(props.index);
   }

   const getHideIcon = (): JSX.Element | undefined => imagesAndVideosBlockContext.mode === "edit"
      ? (
         <div
            className={`${styles.hideIcon} ${hideIconHoverAndTouchClassNames.className} unselectable`}
            onClick={deleteImageOrVideo}
            onMouseEnter={hideIconHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={hideIconHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={hideIconHoverAndTouchClassNames.touchEndListener}
         >
            <img src="./icons/hideMiniWhite.svg" />
         </div>
      )
      : undefined




   useEffect(() => {
      setTimeout(() => {
         if (contentRef.current && contentRef.current instanceof Element) {

            setTimeout(() => {
               const sizes = contentRef.current!.getBoundingClientRect();

               if ((sizes.height < 50 && sizes.width >= 78) || (sizes.height >= 17 && sizes.width < 78)) {
                  setPlayIconClassName(styles.playIconMini);
               } else if (sizes.width < 51 && sizes.height < 51) {
                  setPlayIconClassName(styles.playIconHidden);
               } else {
                  setPlayIconClassName(styles.playIcon);
               }
            }, 0)
         }
      }, 0);
   }, [props.arrLength, contentRef.current, props.containerSizes[0]])


   useEffect(() => {
      if (contentRef.current) {
         if (props.arrLength === 1) {
            let videoWidth: number = props.sizes[0];
            let videoHeight: number = props.sizes[1];
            let videoAspect = videoHeight / videoWidth;
            let containerAspect = 350 / 510;


            let containerWidth = props.containerSizes[0];
            let containerHeight = containerWidth * containerAspect;


            if ((videoHeight > containerHeight) && (videoAspect > containerAspect)) {
               setIframeStyle({
                  height: `${containerHeight}px`,
                  width: `${containerHeight / videoAspect}px`
               })
            } else if ((videoWidth > containerWidth) && (videoAspect < containerAspect)) {
               setIframeStyle({
                  height: `${containerWidth * videoAspect}px`,
                  width: `${containerWidth}px`
               })
            } else {
               setIframeStyle({
                  height: `${videoHeight}px`,
                  width: `${videoWidth}px`
               })
            }

         } else if (props.arrLength >= 2) {
            setIframeStyle({
               height: `100%`,
               width: `100%`
            })
         }
      }
   }, [props.sizes, props.index, iframeRef.current, contentRef.current, props.containerSizes[0], props.arrLength, props.gridDirection])



   return (
      props.type === "image"
         ? <CustomImage
            wrapperRef={contentRef}
            src={props.src}
            additionalClass={`${styles.imageContainer} unselectable`}
            additionalImageClass={styles.image}
            jsx={getHideIcon()}
            onImgClick={imageAndVideoClickHandler}
            onLoad={() => {
               if (context.updateLoadingStatusesItem) {
                  context.updateLoadingStatusesItem(props.index, true, "image/video")
               }

               // console.log("image was loaded")
            }}
         />
         : <div className={`${styles.imageContainer} unselectable`} ref={contentRef} style={imageContainerStyle}>
            <div className={styles.videoContainer} style={iframeStyle} onClick={imageAndVideoClickHandler}>
               <video
                  src={props.src}
                  className={`${styles.video} unselectable`}
                  width={iframeStyle.width}
                  height={iframeStyle.height}
                  onLoad={() => {
                     if (context.updateLoadingStatusesItem) {
                        context.updateLoadingStatusesItem(props.index, true, "image/video")
                     }

                     console.log("video was loaded")
                  }}
               >
               </video>
            </div>
            {getHideIcon()}
            <div
               className={`${playIconClassName} ${playIconHoverAndTouchClassNames.className} unselectable`}
               onClick={imageAndVideoClickHandler}
               onMouseEnter={playIconHoverAndTouchClassNames.mouseEnterListener}
               onTouchStart={playIconHoverAndTouchClassNames.touchStartListener}
               onTouchEnd={playIconHoverAndTouchClassNames.touchEndListener}
            >
               <img src="./icons/play.svg" onClick={imageAndVideoClickHandler} />
            </div>
         </div>
   )
}



export default PostImage