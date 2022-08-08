import { AppContext } from "App";
import { Button } from "common";
import { useAppSelector } from "hooks/redux";
import { Profile } from "pages/Profile/types/types";
import { useEffect, useRef, useState, useContext } from 'react';
import { useCreateInfoConfiguration } from "../hooks/useCreateInfoConfiguration";
import Parameters from "./Parameters";
import styles from './ProfileInfo.module.scss'
import profilePanelStyles from '../ProfilePanel.module.scss'
import { getLoadInfo, getUploadedPostIds, getProfileInfo } from '../../../redux/profileReducer';
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";



type Props = {
   profileInfo: Profile
}

type ShowMoreText = "Show more information" | "Hide more information";

type ShowMoreButtonStyle = {
   transitionDuration?: "0s" | "0.1s" | "0.2s"
}



const ProfileInfo = (props: Props) => {
   const loadInfo = useAppSelector(getLoadInfo);
   const allPostIds = useAppSelector(getProfileInfo).posts;
   const [showMore, setShowMore] = useState<boolean>(false);
   const [showButtonMoreClassName, setShowButtonMoreClassName] = useState<string>(`${styles.showMoreHighlighted} ${styles.showMoreButton}`);
   const [showMoreButtonText, setShowMoreButtonText] = useState<ShowMoreText>("Show more information");
   const [highlightShowMoreButton, setHighlightShowMoreButton] = useState<boolean>(false);
   const [showInformationBlocks, setshowInformationBlocks] = useState<boolean>(false);
   const showMoreButtonRef = useRef<HTMLButtonElement>(null);
   const [showMoreButtonStyle, setShowMoreButtonStyle] = useState<ShowMoreButtonStyle>({});
   const [showFullInfo, setShowFullInfo] = useState<boolean>(false);
   const profileInfoRef = useRef<HTMLDivElement>(null);
   const setShowPreloader = useContext(AppContext).setShowPreloader!;
   const [hideFullInfoOnTouchTimeout, setHideFullInfoOnTouchTimeout] = useState<NodeJS.Timeout | null>(null);
   const showMorePseudoClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);

   const {
      informationBlocks,
      profileInfoClassname,
      showProfileInfoClassname,
      hideProfileInfoClassname,
      setProfileInfoClassname,

   } = useCreateInfoConfiguration(props.profileInfo, loadInfo.loaded, styles, allPostIds.length);

   console.log("allPostIds", allPostIds)

   const showMoreClickListener = () => {
      showMorePseudoClassNames.clickListener();

      if (showMore) {
         setShowMore(false);
      } else {
         setShowMore(true);
      }
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
         setTimeout(() => {
            setShowButtonMoreClassName(`${styles.showMoreTemporarilyHighlighted} ${styles.showMoreButton}`);
         }, 0);

      } else if (showButtonMoreClassName === `${styles.showMoreTemporarilyHighlighted} ${styles.showMoreButton}` && showMoreButtonRef.current) {
         const transitionEndListener = () => {
            setShowButtonMoreClassName(`${styles.showMoreButton}`);
         };

         setTimeout(() => {
            setShowButtonMoreClassName(`${styles.showMoreButton}`);
         }, 0)

         showMoreButtonRef.current.addEventListener("transitionend", transitionEndListener, { once: true });
      }
   }, [highlightShowMoreButton, showButtonMoreClassName, showMoreButtonRef.current])


   useEffect(() => {
      if (showMore) {
         setProfileInfoClassname(showProfileInfoClassname);
         setShowMoreButtonText("Hide more information");
         setShowButtonMoreClassName(`${styles.showMoreHighlighted} ${styles.showMoreButton}`);
      } else {
         setProfileInfoClassname(hideProfileInfoClassname);
         setShowMoreButtonText("Show more information");
         setShowButtonMoreClassName(`${styles.showMoreButton} ${styles.showMoreWithoutTransition}`);
         setTimeout(() => setShowButtonMoreClassName(styles.showMoreButton), 100);
      }
   }, [showMore, showProfileInfoClassname, hideProfileInfoClassname])


   useEffect(() => {
      if (informationBlocks) {
         setshowInformationBlocks(false);
         setTimeout(() => setshowInformationBlocks(true));
      }
   }, [informationBlocks])




   return (
      <div className={`${profileInfoClassname} ${profilePanelStyles.profileInfo}`} ref={profileInfoRef}>
         {
            showInformationBlocks ?
               informationBlocks!.map((block) => (
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
                  containerStyle: showMoreButtonStyle,
                  buttonRef: showMoreButtonRef,
                  changeStyleOnHover: false,
                  mouseEnterHandler: showMorePseudoClassNames.mouseEnterListener,
                  touchStartHandler: showMorePseudoClassNames.touchStartListener,
                  touchEndHandler: showMorePseudoClassNames.touchEndListener,
               }
            }
         />
      </div>
   )
}

export default ProfileInfo