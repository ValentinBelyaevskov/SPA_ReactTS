import { CustomImage } from "common"
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames"
import styles from './PanelForCreatingAPost.module.scss'
import { useEffect, useState, useRef } from 'react';
import { GridDirection } from "./hooks/usePostImagesAndVideosBlock";
import { ImagesAndVideosBlockContext } from './PanelForCreatingAPost';
import { useContext } from 'react';



type Props = {
   src: string
   index: number
   deleteImageOrVideo: (index: number) => void
   type: "image" | "video"
   sizes: [number, number]
   arrLength: number
   containerWidth: number
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
   const [playIconClassName, setPlayIconClassName] = useState<string>(styles.playIcon);
   const hideIconHoverAndTouchClassNames = useHoverAndTouchClassNames();
   const playIconHoverAndTouchClassNames = useHoverAndTouchClassNames();
   const iframeRef = useRef<HTMLIFrameElement>(null);
   const [iframeStyle, setIframeStyle] = useState<IframeStyle>({});
   const [imageContainerStyle, setImageContainerStyle] = useState<ImageContainerStyle>({});
   const imagesAndVideosBlockContext = useContext(ImagesAndVideosBlockContext);



   const imageAndVideoClickHandler = (): void => {
      imagesAndVideosBlockContext.setShowVideoAndImageSlider!(true);
      imagesAndVideosBlockContext.setSliderStartIndex!(props.index);
   }

   const deleteImageOrVideo = (): void => {
      props.deleteImageOrVideo(props.index);
   }

   const getHideIcon = (): JSX.Element => (
      <div
         className={`${styles.hideIcon} ${hideIconHoverAndTouchClassNames.className} unselectable`}
         onMouseEnter={() => hideIconHoverAndTouchClassNames.setHoverClassName(styles.hover)}
         onMouseLeave={() => hideIconHoverAndTouchClassNames.setHoverClassName("")}
         onTouchStart={() => hideIconHoverAndTouchClassNames.setTouchClassName(styles.touch)}
         onTouchEnd={() => hideIconHoverAndTouchClassNames.resetTouchClassName(true)}
         onClick={deleteImageOrVideo}
      >
         <img src="./icons/hideMini.svg" />
      </div>
   );



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
   }, [props.arrLength, contentRef.current, props.containerWidth])


   useEffect(() => {
      if (contentRef.current) {
         if (props.arrLength === 1) {
            let videoWidth: number = props.sizes[0];
            let videoHeight: number = props.sizes[1];
            let videoAspect = videoHeight / videoWidth;
            let containerAspect = 350 / 510;
            let containerWidth = props.containerWidth;
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
   }, [props.sizes, props.index, iframeRef.current, contentRef.current, props.containerWidth, props.arrLength, props.gridDirection])



   return (
      props.type === "image"
         ? <CustomImage
            wrapperRef={contentRef}
            src={props.src}
            additionalClass={`${styles.imageContainer} unselectable`}
            additionalImageClass={styles.image}
            jsx={getHideIcon()}
            onClick={imageAndVideoClickHandler}
         />
         : <div className={`${styles.imageContainer} unselectable`} ref={contentRef} style={imageContainerStyle}>
            <div className={styles.videoContainer} style={iframeStyle} onClick={imageAndVideoClickHandler}>
               <video
                  src={props.src}
                  className={`${styles.video} unselectable`}
                  width={iframeStyle.width}
                  height={iframeStyle.height}
               >
               </video>
            </div>
            {getHideIcon()}
            <div
               className={`${playIconClassName} ${playIconHoverAndTouchClassNames.className} unselectable`}
               onMouseEnter={() => playIconHoverAndTouchClassNames.setHoverClassName(styles.hover)}
               onMouseLeave={() => playIconHoverAndTouchClassNames.setHoverClassName("")}
               onTouchStart={() => playIconHoverAndTouchClassNames.setTouchClassName(styles.touch)}
               onTouchEnd={() => playIconHoverAndTouchClassNames.resetTouchClassName(true)}
            >
               <img src="./icons/play.svg" />
            </div>
         </div>
   )
}



export default PostImage