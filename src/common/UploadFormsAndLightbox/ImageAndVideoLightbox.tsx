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
   playVideoListener?: () => void
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
   const resize = useWindowSize("resize");
   const popupForm = usePopupForm(props.finishWatching);
   const closeButtonHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const leftArrowHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const rightArrowHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const [indexString, setIndexString] = useState<string>(`${itemIndex} / ${props.contentArr.length}`);
   const [moveUpClassName, setMoveUpClassName] = useState<string | undefined>(undefined);




   const closeButtonClickHandler = (e: React.MouseEvent): void => {
      closeButtonHoverAndTouchClassNames.clickListener();
      popupForm.hideEditorStyle();
      popupForm.setClickedButtonName(e);
      resize.removeEventListener();
   }

   const arrowRightClickHandler = (): void => {
      rightArrowHoverAndTouchClassNames.clickListener();

      if (itemIndex < props.contentArr.length - 1) {
         setItemIndex(itemIndex + 1);
      } else {
         setItemIndex(0);
      }
   }

   const arrowLeftClickHandler = (): void => {
      leftArrowHoverAndTouchClassNames.clickListener();

      if (itemIndex > 0) {
         setItemIndex(itemIndex - 1);
      } else {
         setItemIndex(props.contentArr.length - 1);
      }
   }




   useEffect(() => {
      if (props.contentArr.length > 1) {
         setMoveUpClassName(styles.moveUp);
      } else {
         setMoveUpClassName("");
      }
   }, [props.contentArr.length])


   useEffect(() => {
      resize.removeEventListener();
      resize.addEventListener();
   }, []);


   useEffect(() => {
      // console.log(props.contentArr, itemIndex)

      const media: ContentArrItem = props.contentArr[itemIndex];
      const mediaSizes: [number, number] = media.sizes!;
      const mediaWidth: number = mediaSizes![0];
      const mediaHeight: number = mediaSizes![1];
      const mediaAspect: number = media.aspect!;
      const windowWidth: number = resize.value[0];
      const windowHeight: number = resize.value[1];
      const containerHeight: number = windowHeight - 115;
      const containerWidth: number = windowWidth > 1000
         ? (
            props.contentArr.length > 1
               ? 850
               : 950
         )
         : (
            props.contentArr.length > 1
               ? windowWidth - (resize.value[0] > 550
                  ? 140
                  : 115
               )
               : windowWidth - 60
         );
      const containerAspect: number = containerHeight / containerWidth;


      if ((mediaHeight > containerHeight) && (mediaAspect > containerAspect)) {
         setContentStyle({
            height: `${containerHeight}px`,
            width: `${containerHeight / mediaAspect}px`,
            left: `${(windowWidth - (containerHeight / mediaAspect)) / 2}px`,
            top: `${(windowHeight - containerHeight) / 2}px`
         })
      } else if ((mediaWidth > containerWidth) && (mediaAspect < containerAspect)) {
         setContentStyle({
            height: `${containerWidth * mediaAspect}px`,
            width: `${containerWidth}px`,
            left: `${(windowWidth - containerWidth) / 2}px`,
            top: `${(windowHeight - (containerWidth * mediaAspect)) / 2}px`
         })
      } else {
         setContentStyle({
            height: `${mediaHeight}px`,
            width: `${mediaWidth}px`,
            left: `${(windowWidth - mediaWidth) / 2}px`,
            top: `${(windowHeight - mediaHeight) / 2}px`
         })
      }
   }, [itemIndex, resize.value[0], resize.value[1], props.contentArr.length])


   useEffect(() => {
      setIndexString(`${itemIndex + 1} / ${props.contentArr.length}`)
   }, [props.contentArr.length, itemIndex])




   return (
      <div className={styles.lightbox} style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener}>
         <div
            className={`${styles.hideIcon} ${closeButtonHoverAndTouchClassNames.className}  headerControlsElement unselectable`}
            onClick={closeButtonClickHandler}
            onMouseEnter={closeButtonHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={closeButtonHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={closeButtonHoverAndTouchClassNames.touchEndListener}
         >
            <img src="./icons/hideWhite.svg" alt="hide icon" />
         </div>
         {
            props.contentArr.length > 1
               ? (
                  <>
                     <div className={styles.index}>
                        {indexString}
                     </div>
                     <div className={styles.rowsContainer}>
                        <img
                           className={`${styles.arrowLeft} ${moveUpClassName} ${leftArrowHoverAndTouchClassNames.className} unselectable`}
                           src="./icons/arrowLeft.svg"
                           alt="left arr"
                           onClick={arrowLeftClickHandler}
                           onMouseEnter={leftArrowHoverAndTouchClassNames.mouseEnterListener}
                           onTouchStart={leftArrowHoverAndTouchClassNames.touchStartListener}
                           onTouchEnd={leftArrowHoverAndTouchClassNames.touchEndListener}
                        />
                        <img
                           className={`${styles.arrowRight} ${rightArrowHoverAndTouchClassNames.className} unselectable`}
                           src="./icons/arrowRight.svg"
                           alt="left arr"
                           onClick={arrowRightClickHandler}
                           onMouseEnter={rightArrowHoverAndTouchClassNames.mouseEnterListener}
                           onTouchStart={rightArrowHoverAndTouchClassNames.touchStartListener}
                           onTouchEnd={rightArrowHoverAndTouchClassNames.touchEndListener}
                        />
                     </div>
                  </>
               )
               : null
         }
         {
            props.contentArr[itemIndex] && props.contentArr[itemIndex].type === "video"
               ? (
                  <div className={styles.videoContainer} style={contentStyle}>
                     <video
                        className={`${styles.video} ${moveUpClassName}`}
                        width={contentStyle.width}
                        height={contentStyle.height}
                        onPlay={props.playVideoListener}
                        muted={true}
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
                        additionalImageClass={`${styles.image} ${moveUpClassName} `}
                        src={props.contentArr[itemIndex].src}
                     />
                  )
                  : null
         }
      </div>
   )
}



export default ImageAndVideoLightbox