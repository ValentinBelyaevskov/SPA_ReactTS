import { AppContext } from "App";
import { Button } from "common";
import { useAppSelector } from "hooks/redux";
import { Profile } from "pages/Profile/types/types";
import { useEffect, useRef, useState, useContext } from 'react';
import { useCreateInfoConfiguration } from "../hooks/useCreateInfoConfiguration";
import Parameters from "./Parameters";
import styles from './ProfileInfo.module.scss'
import profilePanelStyles from '../ProfilePanel.module.scss'
import { getLoadInfo } from '../../../redux/profileReducer';
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";



type Props = {
   profileInfo: Profile
}

type ShowMoreText = "Show more information" | "Hide more information";

type ShowMoreButtonStyle = {
   transitionDuration?: "0s" | "0.1s" | "0.2s"
   outline?: "1px solid #cccccc" | "1px solid rgba(0, 0, 0, 0)"
}



const ProfileInfo = (props: Props) => {
   const loadInfo = useAppSelector(getLoadInfo);
   const [showMore, setShowMore] = useState<boolean>(false);
   const [showButtonMoreClassName, setShowButtonMoreClassName] = useState<string>(`${styles.showMoreHighlighted} ${styles.showMoreButton}`);
   const [showMoreButtonText, setShowMoreButtonText] = useState<ShowMoreText>("Show more information");
   const [highlightShowMoreButton, setHighlightShowMoreButton] = useState<boolean>(false)
   const showMoreButtonRef = useRef<HTMLButtonElement>(null);
   const [showMoreButtonStyle, setShowMoreButtonStyle] = useState<ShowMoreButtonStyle>({ transitionDuration: "0s" });
   const [showFullInfo, setShowFullInfo] = useState<boolean>(false);
   const profileInfoRef = useRef<HTMLDivElement>(null);
   const setShowPreloader = useContext(AppContext).setShowPreloader!;
   const [hideFullInfoOnTouchTimeout, setHideFullInfoOnTouchTimeout] = useState<NodeJS.Timeout | null>(null);
   const showMorePseudoClassNames = useHoverAndTouchClassNames();
   const {
      informationBlocks,
      profileInfoClassname,
      showProfileInfoClassname,
      hideProfileInfoClassname,
      setProfileInfoClassname,
   } = useCreateInfoConfiguration(props.profileInfo, loadInfo.loaded, styles);



   const showMoreClickListener = () => {
      if (showMore) {
         setShowMore(false);
      } else {
         setShowMore(true);
      }
   }

   const showMoreMouseUpHandler = (): void => {
      setShowMoreButtonStyle({
         transitionDuration: "0s",
      });
      setTimeout(() => {
         setShowMoreButtonStyle({});
      }, 100);
   }



   useEffect(() => {
      if (!loadInfo.loaded) return
      if (profileInfoRef.current!.classList.length === 5) {
         setShowPreloader(false);
         setShowFullInfo(false);
      } else if (profileInfoRef.current!.classList.length === 4) {
         setShowFullInfo(true);
      }
   }, [loadInfo.loaded, profileInfoClassname, profileInfoRef.current])


   useEffect(() => {
      if (highlightShowMoreButton) {
         setShowMoreButtonStyle({
            transitionDuration: "0.2s",
         });
         setTimeout(() => {
            setShowButtonMoreClassName(`${styles.showMoreTemporarilyHighlighted} ${styles.showMoreButton}`);
         }, 0);

      } else if (showButtonMoreClassName === `${styles.showMoreTemporarilyHighlighted} ${styles.showMoreButton}` && showMoreButtonRef.current) {
         const transitionEndListener = () => {
            setShowButtonMoreClassName(`${styles.showMoreButton}`);
         };

         setShowMoreButtonStyle({
            transitionDuration: "0.1s",
         });
         setTimeout(() => {
            setShowButtonMoreClassName(`${styles.showMoreButton}`);
         }, 0);

         showMoreButtonRef.current.addEventListener("transitionend", transitionEndListener, { once: true });
      }
   }, [highlightShowMoreButton, showButtonMoreClassName, showMoreButtonStyle.outline, showMoreButtonRef.current])


   useEffect(() => {
      if (showMore) {
         setProfileInfoClassname(showProfileInfoClassname)
         setShowMoreButtonText("Hide more information")
         setShowButtonMoreClassName(`${styles.showMoreHighlighted} ${styles.showMoreButton}`)
      } else {
         setProfileInfoClassname(hideProfileInfoClassname)
         setShowMoreButtonText("Show more information")
         setShowButtonMoreClassName(`${styles.showMoreButton}`)
      }
   }, [showMore, showProfileInfoClassname, hideProfileInfoClassname])



   return (
      <div className={`${profileInfoClassname} ${profilePanelStyles.profileInfo}`} ref={profileInfoRef}>
         {
            informationBlocks ?
               informationBlocks.map((block) => (
                  (block.length === 1 && block[0].length > 1)
                     || (block.length > 1 && block[0].length === 1) ?
                     <Parameters
                        key={block[0][0]}
                        block={block}
                        showFullInfo={showFullInfo}
                        setHighlightShowMoreButton={setHighlightShowMoreButton}
                        hideFullInfoOnTouchTimeout={hideFullInfoOnTouchTimeout}
                        setHideFullInfoOnTouchTimeout={setHideFullInfoOnTouchTimeout}
                     />
                     : null
               ))
               : null
         }
         <Button
            params={
               {
                  text: showMoreButtonText,
                  clickHandler: showMoreClickListener,
                  containerClassName: styles.showMoreButtonContainer,
                  buttonClassName: `${showButtonMoreClassName} ${showMorePseudoClassNames.className}`,
                  buttonStyle: showMoreButtonStyle,
                  buttonRef: showMoreButtonRef,
                  mouseUpHandler: showMoreMouseUpHandler,
                  changeStyleOnHover: false,
                  mouseEnterHandler: () => showMorePseudoClassNames.setHoverClassName(styles.hover),
                  mouseLeaveHandler: () => showMorePseudoClassNames.setHoverClassName(""),
                  touchStartHandler: () => showMorePseudoClassNames.setTouchClassName(styles.touch),
                  touchEndHandler: () => showMorePseudoClassNames.resetTouchClassName(true),
               }
            }
         />
      </div>
   )
}

export default ProfileInfo