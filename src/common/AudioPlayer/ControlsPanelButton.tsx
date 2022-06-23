import { useEffect, useState } from 'react';
import { ButtonConfig } from './ControlsPanel';
import styles from './ControlsPanel.module.scss';
import Slider from './Slider';
import { useHoverAndTouchClassNames } from '../../hooks/useHoverAndTouchClassNames';
import { icons } from './PlayerInterface';




type Props = {
   buttonConfig: ButtonConfig
}




const ControlsPanelButton = (props: Props) => {
   const [element, setElement] = useState<JSX.Element | null>(null);
   const config = props.buttonConfig;
   const buttonHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);



   const buttonClickHandler = () => {
      config.clickHandler!();
      buttonHoverAndTouchClassNames.clickListener();
   }



   useEffect(() => {
      if (config.element === 'img') {
         const iconName: string = config.name === 'soundToggler'
            ? (
               config.togglerValue
                  ? "turnOnTheSound"
                  : "turnOffTheSound"
            )
            :
            config.name === 'play'
               ? (
                  config.togglerValue
                     ? "pause"
                     : "play"
               )
               : config.name

         const src: string = icons.find(path => path.includes(iconName))!;

         setElement(
            <img
               className={`${styles[config.name]} ${buttonHoverAndTouchClassNames.className} unselectable`}
               onClick={buttonClickHandler}
               onMouseEnter={buttonHoverAndTouchClassNames.mouseEnterListener}
               onTouchStart={buttonHoverAndTouchClassNames.touchStartListener}
               onTouchEnd={buttonHoverAndTouchClassNames.touchEndListener}
               src={src}
            />
         );

      } else if (config.element === 'slider') {
         setElement(
            <Slider
               additionalClass={`${styles[config.name]} unselectable`}
               windowSize={config.windowSize!}
               percentage={config.percentage!}
               reset={!config.togglerValue}
               onChange={config.callback!}
               showPlaylist={config.showPlaylist}
            />
         )

      } else if (config.element === 'button') {
         setElement(
            <button
               className={`${styles[config.name]} ${buttonHoverAndTouchClassNames.className} ${config.buttonValue === 1 ? styles.oneX : styles.twoX} unselectable`}
               type='button'
               onClick={buttonClickHandler}
               onMouseEnter={buttonHoverAndTouchClassNames.mouseEnterListener}
               onTouchStart={buttonHoverAndTouchClassNames.touchStartListener}
               onTouchEnd={buttonHoverAndTouchClassNames.touchEndListener}
            >
               {config.text}
            </button>
         )
      }


      if (config.renderEventSubscriber) {
         config.renderEventSubscriber();
      }

   }, [
      buttonHoverAndTouchClassNames.className,
      config.name,
      config.windowSize,
      config.togglerValue,
      config.buttonValue,
      config.percentage,
      config.prevPercentage,
      config.showPlaylist,
      config.activeTrackId,
      config.renderEventSubscriber,
      config.fileIdsLength
   ])




   return element
}




export default ControlsPanelButton