import { Profile } from "pages/Profile/types/types";
import { useEffect, useState } from "react";


type ParametersListItem = (string | undefined | number | null)[];
type StringParametersListItem = (string | undefined)[];
type ParametersList = ParametersListItem[] | [];


export const useCreateInfoConfiguration = (profileInfo: Profile, profileInfoLoaded: boolean, styles: any) => {
   const [hideProfileInfoClassname, setHideProfileInfoClassname] = useState<string>(`${styles.profileInfo} ${styles.hideMoreInfo}`);
   const [showProfileInfoClassname, setShowProfileInfoClassname] = useState<string>(styles.profileInfo);
   const [profileInfoClassname, setProfileInfoClassname] = useState<string>(hideProfileInfoClassname);
   const [informationBlocks, setInformationBlocks] = useState<ParametersList[] | null>(null);
   const [informationBlocksIsFull, setInformationBlocksIsFull] = useState<boolean>(false);



   const setProfileInfoClassnames = (height: string, grid: string) => {
      const show: string = styles.profileInfo;
      const hide: string = `${styles.profileInfo} ${styles.hideMoreInfo}`;

      setShowProfileInfoClassname(`${show} ${height} ${grid}`);
      setHideProfileInfoClassname(`${hide} ${height} ${grid}`);
   }



   useEffect(() => {
      setInformationBlocks([
         [
            ["personalInformation"],
         ],
         [
         ],
         [
            ["profileInformation"],
            ["friends", 0],
         ],
         [
            ["communities", 0],
         ],
         [
            ["posts", 0]
         ]
      ])
   }, []);


   useEffect(() => {
      setInformationBlocksIsFull(false);
   }, [profileInfo.location, profileInfo.dateOfBirth, profileInfo.education])


   useEffect(() => {
      if (!informationBlocks || informationBlocksIsFull) return;


      const briefPersonalInfo: ParametersList = [
         ["location", profileInfo.location],
         ["dateOfBirth", profileInfo.dateOfBirth]
      ];
      let briefPersonalInfoLength: number = briefPersonalInfo.length;
      const morePersonalInfo: StringParametersListItem = ["education", profileInfo.education];
      const informationBlocksCopy: ParametersList[] = informationBlocks.map(
         item => item.map(
            subItem => typeof subItem === "object" ?
               subItem.map(subSubItem => subSubItem)
               : subItem
         )
      );


      for (let i = 0; i < briefPersonalInfoLength; i++) {
         if (briefPersonalInfo[i][1] && `${briefPersonalInfo[i][1]}`.length && (typeof briefPersonalInfo[i][1] === "string" || typeof briefPersonalInfo[i][1] === "number")) {
            informationBlocksCopy[0][i + 1] = briefPersonalInfo[i];
         } else {
            --briefPersonalInfoLength;
            --i;
         }
      }

      if (morePersonalInfo && morePersonalInfo[1] && morePersonalInfo[1].length && (typeof morePersonalInfo[1] === "string")) {
         if (informationBlocksCopy[0].length > 1) {
            informationBlocksCopy[1] = [[...morePersonalInfo]];
         } else if (informationBlocksCopy[0].length === 1) {
            informationBlocksCopy[1][0] = ["personalInformation"];
            informationBlocksCopy[1][1] = morePersonalInfo;
         }

         if (!informationBlocksIsFull) setInformationBlocksIsFull(true);
      } else {
         if (!informationBlocksIsFull) setInformationBlocksIsFull(true);
      }


      setInformationBlocks(informationBlocksCopy)

   }, [informationBlocks, informationBlocksIsFull]);


   useEffect(() => {
      if (informationBlocksIsFull && informationBlocks && profileInfoLoaded) {
         const briefPersonInfo: ParametersList = informationBlocks[0].slice(1);
         const morePersonInfo: ParametersList = informationBlocks[1];
         const fullHeight: string = styles.fullHeight;
         const notFullHeight: string = styles.notFullHeight;


         if (briefPersonInfo.length === 2 && morePersonInfo.length === 1) {
            setProfileInfoClassnames(notFullHeight, styles.gridV1)
         } else if (briefPersonInfo.length === 2 && morePersonInfo.length === 0) {
            setProfileInfoClassnames(fullHeight, styles.gridV2)
         } else if (briefPersonInfo.length === 1 && morePersonInfo.length === 1) {
            setProfileInfoClassnames(fullHeight, styles.gridV3)
         } else if (briefPersonInfo.length === 1 && morePersonInfo.length === 0) {
            setProfileInfoClassnames(fullHeight, styles.gridV4)
         } else if (briefPersonInfo.length === 0 && morePersonInfo.slice(1).length === 1) {
            setProfileInfoClassnames(fullHeight, styles.gridV5)
         } else if (briefPersonInfo.length === 0 && morePersonInfo.length === 0) {
            setProfileInfoClassnames(notFullHeight, styles.gridV6)
         }
      }
   }, [informationBlocks, informationBlocksIsFull, profileInfoLoaded])



   return {
      informationBlocks,
      profileInfoClassname,
      showProfileInfoClassname,
      hideProfileInfoClassname,
      setProfileInfoClassname
   }
}