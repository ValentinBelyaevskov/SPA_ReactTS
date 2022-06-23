import { useState } from 'react'
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import Full from './Full';
import Thumbnail from './Thumbnail';
import { PlayerName } from './types/types';
import { useAppSelector } from '../../hooks/redux';
import { getPlayerConfig,  getPlayerState } from './redux/audioPlayerReducer';




type Props = {
   name: PlayerName
}




export const icons = [
   "./icons/playTheme.svg",
   "./icons/pauseTheme.svg",
   "./icons/prevTheme.svg",
   "./icons/nextTheme.svg",
   "./icons/turnOnTheSoundTheme.svg",
   "./icons/turnOffTheSoundTheme.svg",
   "./animatedIcons/preloader2.svg"
];




const PlayerInterface = (props: Props) => {
   const config = useAppSelector(getPlayerConfig(props.name));
   const state = useAppSelector(getPlayerState(props.name));
   const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);




   if (state.showAudioPlayer) {
      return (
         <>
            {
               iconsLoaded
                  ? (
                     config!.mode === 'full'
                        ? <Full playerName={props.name} />
                        : config!.mode === 'thumbnail'
                           ? (
                              <Thumbnail playerName={props.name} />
                           )
                           : null
                  )
                  : null
            }
            <IconsThatAreLoaded
               icons={icons}
               setIconsLoaded={setIconsLoaded!}
            />
         </>
      )
   } else {
      return <></>
   }
}




export default PlayerInterface