import { useEffect, useState } from "react";


export type AppCtxtHook = {
   profileInfoLoading: boolean,
   profileWallLoading: boolean,
   showAudioPlayer: boolean
   profileContentLoading: boolean
   setShowAudioPlayer: React.Dispatch<React.SetStateAction<boolean>>
   setProfileContentLoading: React.Dispatch<React.SetStateAction<boolean>>
   setProfileInfoLoading: React.Dispatch<React.SetStateAction<boolean>>
   setProfileWallLoading: React.Dispatch<React.SetStateAction<boolean>>
}


export const useAppContext = (): AppCtxtHook => {
   const [profileContentLoading, setProfileContentLoading] = useState<boolean>(true);
   const [profileInfoLoading, setProfileInfoLoading] = useState<boolean>(true);
   const [profileWallLoading, setProfileWallLoading] = useState<boolean>(true);
   const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);




   useEffect(() => {
      if (profileInfoLoading || profileWallLoading) {
         setProfileContentLoading(true);
      } else {
         setProfileContentLoading(false);
      }
   }, [profileInfoLoading, profileWallLoading])




   return {
      profileInfoLoading,
      profileWallLoading,
      profileContentLoading,
      showAudioPlayer,
      setShowAudioPlayer,
      setProfileInfoLoading,
      setProfileWallLoading,
      setProfileContentLoading,
   }
}