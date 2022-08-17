import { useAppSelector } from "hooks/redux"
import AudioElementsItem from "./AudioElementsItem";
import { getPlayerNames, getPlayerStatuses, getPlayers } from './redux/audioPlayerReducer';

type Props = {
}


const AudioElements = (props: Props) => {
   const playerNames = useAppSelector(getPlayerNames);
   const playerStatuses = useAppSelector(getPlayerStatuses)




   return (
      <>
         {
            playerNames.map((name, index) => (
               playerStatuses[index]
                  ? < AudioElementsItem key={name} name={name} />
                  : null
            ))
         }
      </>
   )
}

export default AudioElements