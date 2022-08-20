import { useAppSelector } from "hooks/redux";
import { Profile } from "pages";
import { getLoadInfo, getProfileInfo, getProfileMode } from "pages/Profile/redux/profileReducer";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";




type Props = {
   setRouteProfileId: React.Dispatch<React.SetStateAction<string | undefined>>
}




export const ProfileRouteDisplay = (props: Props) => {
   const { profileId } = useParams();
   const profile = useAppSelector(getProfileInfo);

   // * profileId надо сохранить

   //    profileMode:
   //    1) loggedIn
   //    
   //       loading === true ?
   //       /SignIn
   //       : /profileId
   //       
   //          profileId === profile.objectId ?
   //          /frieds/profileId   
   //          : /profileId
   //    
   //    
   //    2) !== loggenIn
   //    
   //    /SignIn
   //    
   //    
   //    
   //    
   //    


   useEffect(() => {
      props.setRouteProfileId(profileId);
   }, [profileId])



   // * !profile.objectId - нужен для того что бы
   // * перенаправлять на /SignIn с /profileId, когда
   // * profile.objectId ещё неизвестен.

   // * !profile.objectId фактически не используется 
   // * при попадании с /SignIn. С /SignIn происходит
   // * переход с уже известным profile.objectId.

   return (
      <>
         {
            (
               !profile.objectId
            )
               ? <Navigate to="/SignIn" replace />
               : <Profile />

         }
      </>
   )
}