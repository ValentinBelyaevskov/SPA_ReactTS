import styles from "./ImageAndVideoLightbox.module.scss";
import { useState, useEffect } from 'react';
import { usePopupForm } from "hooks/usePopup/usePopupForm";
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";
import { useWindowSize } from '../../hooks/useWindowSize';
import CustomImage from "common/Image/CustomImage";



export type ContentArrItem = {
   type: "image" | "video"
   src?: string,
   file?: File,
   aspect?: number,
   area?: number,
   sizes?: [number, number]
}

interface Props {
   finishWatching: () => void
   contentArr: ContentArrItem[]
   itemIndex: number
}

type ContentStyle = {
   width?: string
   height?: string
   left?: string
   top?: string
}



const ImageAndVideoLightbox = (props: Props) => {
   const [contentStyle, setContentStyle] = useState<ContentStyle>({});
   const [itemIndex, setItemIndex] = useState<number>(props.itemIndex);
   const [sizes, setSizes] = useState<[number, number]>([0, 0]);
   const resize = useWindowSize("resize");
   const popupForm = usePopupForm(props.finishWatching);
   const closeButtonHoverAndTouchClassNames = useHoverAndTouchClassNames();
   const leftArrowHoverAndTouchClassNames = useHoverAndTouchClassNames();
   const rightArrowHoverAndTouchClassNames = useHoverAndTouchClassNames();



   const closeButtonClickHandler = (e: React.MouseEvent): void => {
      popupForm.hideEditorStyle();
      popupForm.setClickedButtonName(e);
      resize.removeEventListener();
   }

   const arrowRightClickHandler = (): void => {
      if (itemIndex < props.contentArr.length - 1) {
         setItemIndex(itemIndex + 1);
      } else {
         setItemIndex(0);
      }
   }

   const arrowLeftClickHandler = (): void => {
      if (itemIndex > 0) {
         setItemIndex(itemIndex - 1);
      } else {
         setItemIndex(props.contentArr.length - 1);
      }
   }

   const getArrows = (): JSX.Element => (
      <div className={styles.rowsContainer}>
         <img
            className={`${styles.arrowLeft} ${leftArrowHoverAndTouchClassNames.className} unselectable`}
            src="./icons/arrowLeft.svg"
            alt="left arr"
            onClick={arrowRightClickHandler}
            onMouseEnter={() => leftArrowHoverAndTouchClassNames.setHoverClassName(styles.hover)}
            onMouseLeave={() => leftArrowHoverAndTouchClassNames.setHoverClassName("")}
            onTouchStart={() => leftArrowHoverAndTouchClassNames.setTouchClassName(styles.touch)}
            onTouchEnd={() => leftArrowHoverAndTouchClassNames.resetTouchClassName(true)}
         />
         <img
            className={`${styles.arrowRight} ${rightArrowHoverAndTouchClassNames.className} unselectable`}
            src="./icons/arrowRight.svg"
            alt="left arr"
            onClick={arrowLeftClickHandler}
            onMouseEnter={() => rightArrowHoverAndTouchClassNames.setHoverClassName(styles.hover)}
            onMouseLeave={() => rightArrowHoverAndTouchClassNames.setHoverClassName("")}
            onTouchStart={() => rightArrowHoverAndTouchClassNames.setTouchClassName(styles.touch)}
            onTouchEnd={() => rightArrowHoverAndTouchClassNames.resetTouchClassName(true)}
         />
      </div>
   )



   useEffect(() => {
      resize.removeEventListener();
      resize.addEventListener();
   }, []);


   useEffect(() => {
      const media: ContentArrItem = props.contentArr[itemIndex]
      const mediaSizes: [number, number] = media.sizes!;
      const mediaWidth: number = mediaSizes![0];
      const mediaHeight: number = mediaSizes![1];
      const mediaAspect: number = media.aspect!;
      const windowWidth: number = resize.value[0];
      const windowHeight: number = resize.value[1];
      const containerHeight: number = windowHeight - 60;
      const containerWidth: number = windowWidth > 850 ? 850 : windowWidth - 140;
      const containerAspect: number = containerHeight / containerWidth;

      if ((mediaHeight > containerHeight) && (mediaAspect > containerAspect)) {
         console.log(1)
         setContentStyle({
            height: `${containerHeight}px`,
            width: `${containerHeight / mediaAspect}px`,
            left: `${(windowWidth - (containerHeight / mediaAspect)) / 2}px`,
            top: `${(windowHeight - containerHeight) / 2}px`
         })
      } else if ((mediaWidth > containerWidth) && (mediaAspect < containerAspect)) {
         console.log(2)
         setContentStyle({
            height: `${containerWidth * mediaAspect}px`,
            width: `${containerWidth}px`,
            left: `${(windowWidth - containerWidth) / 2}px`,
            top: `${(windowHeight - (containerWidth * mediaAspect)) / 2}px`
         })
      } else {
         console.log(3)
         setContentStyle({
            height: `${mediaHeight}px`,
            width: `${mediaWidth}px`,
            left: `${(windowWidth - mediaWidth) / 2}px`,
            top: `${(windowHeight - mediaHeight) / 2}px`
         })
      }
   }, [itemIndex, resize.value[0], resize.value[1]])



   return (
      <div className={styles.lightbox} style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener}>
         <div
            className={`${styles.hideIcon} ${closeButtonHoverAndTouchClassNames.className} headerControlsElement unselectable`}
            onClick={closeButtonClickHandler}
            onMouseEnter={() => closeButtonHoverAndTouchClassNames.setHoverClassName(styles.hover)}
            onMouseLeave={() => closeButtonHoverAndTouchClassNames.setHoverClassName("")}
            onTouchStart={() => closeButtonHoverAndTouchClassNames.setTouchClassName(styles.touch)}
            onTouchEnd={() => closeButtonHoverAndTouchClassNames.resetTouchClassName(true)}
         >
            <img src="./icons/hideWhite.svg" alt="hide icon" />
         </div>
         {getArrows()}
         {
            props.contentArr[itemIndex] && props.contentArr[itemIndex].type === "video"
               ? (
                  <div className={styles.videoContainer} style={contentStyle}>
                     <video
                        className={styles.video}
                        width={contentStyle.width}
                        height={contentStyle.height}
                        controls
                        src={props.contentArr[itemIndex].src}
                     />
                  </div>
               )
               : props.contentArr[itemIndex] && props.contentArr[itemIndex].type === "image"
                  ? (
                     <CustomImage
                        additionalClass={styles.imageContainer}
                        wrapperStyle={contentStyle}
                        additionalImageClass={styles.image}
                        src={props.contentArr[itemIndex].src}
                     />
                  )
                  : null
         }
      </div>
   )
}



export default ImageAndVideoLightbox