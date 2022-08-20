import styles from './ScrollToTop.module.scss'
import { Button } from 'common';
import { useEffect, useState } from 'react';
import { useScrollOrWindowSize } from 'hooks/useScrollOrWindowSize';
import { useAppSelector } from '../../hooks/redux';
import { getPlayerState, getPlayerStatus } from 'common/AudioPlayer/redux/audioPlayerReducer';




type Props = {
}

export type ButtonStyle = {
   display?: "none"
}



const ScrollToTop = (props: Props) => {
   const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({ display: "none" });
   const scroll = useScrollOrWindowSize("scroll");
   const [prevScroll, setPrevScroll] = useState<number>(0);
   const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
   const generalAudioPlayerStatus = useAppSelector(getPlayerStatus("general"));
   const generalAudioPlayerState = useAppSelector(getPlayerState("general"));
   const [buttonContainerClassName, setButtonContainerClassName] = useState<string>(styles.scrollToTopButtonContainer);




   const buttonClickListener = (): void => {
      document.documentElement.scrollTop = 0;
   }




   useEffect(() => {
      if (scroll.value[1] - prevScroll > 0 || document.documentElement.offsetHeight === document.documentElement.scrollHeight) {
         setScrollDirection("down")
      } else if (scroll.value[1] - prevScroll < 0) {
         setScrollDirection("up")
      }
   }, [prevScroll, scroll.value[1]])


   useEffect(() => {
      scroll.addEventListener();

      return () => {
         scroll.removeEventListener();
      }
   }, [])


   useEffect(() => {
      setPrevScroll(scroll.value[1]);

      if ((scroll.value[1] > 100 && scrollDirection === 'up')) {
         setButtonStyle({});
      } else {
         setButtonStyle({ display: "none" });
      }

      if (generalAudioPlayerState.showPlaylist) {
         setButtonStyle({ display: "none" });
      }
   }, [scroll.value[1], scrollDirection, generalAudioPlayerState.showPlaylist])


   useEffect(() => {
      if (generalAudioPlayerStatus) {
         setButtonContainerClassName(`${styles.scrollToTopButtonContainer} ${styles.audioPlayerShown}`)
      } else {
         setButtonContainerClassName(`${styles.scrollToTopButtonContainer}`)
      }
   }, [generalAudioPlayerStatus])




   return (
      <Button
         params={
            {
               type: "button",
               clickListener: buttonClickListener,
               containerStyle: buttonStyle,
               containerClassName: buttonContainerClassName,
               buttonClassName: styles.scrollToTopButton,
               changeStyleOnHover: true,
               jsx: <img className={styles.scrollToTopButtonArrow} src="./icons/arrowUpWhite.svg" alt="Scroll to top button" />
            }
         }
      />
   )
}




export default ScrollToTop