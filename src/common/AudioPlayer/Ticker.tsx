import { useAppSelector } from "hooks/redux";
import { useEffect, useRef, useState } from "react";
import styles from './Ticker.module.scss'
import { PlayerMode, PlayerName } from "./types/types";
import { audioPlayerActions, getActiveTrackName, getPlayerConfig, getPlayerState } from './redux/audioPlayerReducer';
import { audioPlayerApi } from "./API/audioPlayerAPI";
import { useDispatch } from "react-redux";
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames";



type Props = {
   playerName: PlayerName
   mode: PlayerMode
   tickerClickListener?: () => void
}



const tickerV: number = 40;



const Ticker = (props: Props) => {
   const dispatch = useDispatch();

   const tickerHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);

   const config = useAppSelector(getPlayerConfig(props.playerName));
   const state = useAppSelector(getPlayerState(props.playerName));
   const currentTrackName = useAppSelector(getActiveTrackName(props.playerName));
   const stateAPI = new audioPlayerApi(dispatch, audioPlayerActions, props.playerName);

   const trackNameRef = useRef<HTMLDivElement>(null);
   const tickerContainerRef = useRef<HTMLDivElement>(null);
   const tickerRef = useRef<HTMLDivElement>(null);
   const notVisibleTickerRef = useRef<HTMLDivElement>(null);
   const [trackName, setTrackName] = useState<string>(currentTrackName!);
   const [showNotVisibleTicker, setShowNotVisibleTicker] = useState<boolean>(false);
   const [animationPlayer, setAnimationPlayer] = useState<Animation[]>([]);
   const [tickerItems, setTickerItems] = useState<JSX.Element[]>([getTrackNameElement(1)]);




   function getTrackNameElement(index: number): JSX.Element {
      return (
         <div
            key={index === 1 ? "first" : index === 2 ? "second" : 0}
            className={`${index === 1 ? styles.first : index === 2 ? styles.second : ""} unselectable`}
            ref={trackNameRef} >
            {trackName}
         </div>
      )
   }


   const resetTickerSettings = () => {
      setTickerItems([getTrackNameElement(1)]);
      setShowNotVisibleTicker(false);
      setTimeout(() => setShowNotVisibleTicker(true));

      if (animationPlayer.length) {
         animationPlayer[0].cancel();
         setAnimationPlayer([]);
      }
   }


   const containerClickHandler = (): void => {
      tickerHoverAndTouchClassNames.clickListener();

      if (
         (props.mode === "thumbnail" && config!.mode === "thumbnail")
         || config!.mode === "full"
      ) {
         stateAPI.setShowPlaylist!(!state!.showPlaylist);
         if (props.tickerClickListener) props.tickerClickListener();
      }
   }




   useEffect(() => {
      setTrackName(currentTrackName!);
   }, [currentTrackName])


   useEffect(() => {
      resetTickerSettings();
   }, [trackName, props.mode])


   useEffect(() => {
      if (config.tickerResizeCheckpoints) {
         for (let i = 0; i < config.tickerResizeCheckpoints?.length; i++) {
            if (state.windowSize[0] > config.tickerResizeCheckpoints[i] && state.windowSize[0] < config.tickerResizeCheckpoints[i] + 90) {
               resetTickerSettings();
            }
         }
      }
   }, [state.windowSize[0], config.tickerResizeCheckpoints, props.mode])


   useEffect(() => {
      if (trackNameRef.current && tickerContainerRef.current && tickerRef.current && notVisibleTickerRef.current && showNotVisibleTicker) {
         const ticker = tickerRef.current;
         const nameWidth = trackNameRef.current.getBoundingClientRect().width;

         const containerWidth = tickerContainerRef.current.getBoundingClientRect().width;

         if (nameWidth > containerWidth && !animationPlayer.length) {
            setTickerItems([
               getTrackNameElement(1),
               getTrackNameElement(2)
            ]);

            const duration: number = (nameWidth + 5) / tickerV;

            const animation = ticker.animate([
               { transform: "translateX(3px)" },
               { transform: "translateX(-50%)", offset: duration / (duration + 1) },
               { transform: "translateX(-50%)" },
            ], {
               delay: 1000,
               duration: (duration + 1) * 1000,
               iterations: Infinity
            });

            setAnimationPlayer([animation]);
         } else if (nameWidth < containerWidth && animationPlayer.length) {
            setTickerItems([getTrackNameElement(1)]);

            animationPlayer[0].cancel();

            setAnimationPlayer([]);
         }
      }
   }, [trackNameRef.current, tickerContainerRef.current, tickerRef.current, notVisibleTickerRef.current, state.windowSize[0], showNotVisibleTicker, animationPlayer.length, trackName, props.mode])




   return (
      <div
         className={
            `
            ${styles.trackNameTickerContainer}
            ${tickerHoverAndTouchClassNames.className}
            ${props.mode === "thumbnail" ? styles.thumbnail : ""}
            ${config.adaptToWindowSize && config.mobileBreakPoint && state.windowSize[0] <= config.mobileBreakPoint
               ? styles.mobile
               : ""}
            `
         }
         ref={tickerContainerRef}
         onClick={containerClickHandler}
         onMouseEnter={tickerHoverAndTouchClassNames.mouseEnterListener}
         onTouchStart={tickerHoverAndTouchClassNames.touchStartListener}
         onTouchEnd={tickerHoverAndTouchClassNames.touchEndListener}
      >
         <div className={styles.tickerNameWrapper}>
            <div className={styles.trackNameTicker} ref={tickerRef}>
               {tickerItems.map(item => item)}
            </div>
         </div>
         {showNotVisibleTicker && (
            <div className={styles.notVisibleTrackNameTicker} ref={notVisibleTickerRef}>
               {tickerItems.map(item => item)}
            </div>
         )}
      </div>
   )
}




export default Ticker