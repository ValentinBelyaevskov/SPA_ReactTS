import React, { useRef, useState } from "react";
import { AudioPlayerCtxt, PlayerName } from "./types/types";



export type UseAudioPlayer = {
   audioPlayerContainerRef: React.RefObject<HTMLDivElement>
   audioPlayerContext: AudioPlayerCtxt
}



export const AudioPlayerContext = React.createContext<AudioPlayerCtxt>({});



export const useAudioPlayer = (): UseAudioPlayer => {
   const audioPlayerContainerRef = useRef<HTMLDivElement>(null);
   const [popupAudioElement, setPopupAudioElement] = useState<HTMLAudioElement | undefined>(undefined);
   const [generalAudioElement, setGeneralAudioElement] = useState<HTMLAudioElement | undefined>(undefined);
   const [showPlayerOnPlayBtnClick, setShowPlayerOnPlayBtnClick] = useState<boolean>(false);

   const audioPlayerContext: AudioPlayerCtxt = {
      setPopupAudioElement,
      setGeneralAudioElement,
      getPlayerElement,
      showPlayerOnPlayBtnClick,
      setShowPlayerOnPlayBtnClick
   }




   function getPlayerElement(playerName: PlayerName): (HTMLAudioElement | undefined) {
      return (
         playerName === 'general'
            ? generalAudioElement
            : playerName === 'popup'
               ? popupAudioElement
               : undefined
      )
   }



   return {
      audioPlayerContainerRef,
      audioPlayerContext,
   }
}