import styles from './ProfilePanel.module.scss';
import { useRef, useState, useEffect } from 'react';
import { Popup, usePopupElement } from '../../../../hooks';
import { getProfileInfo, getProfileInfoMode, profileActions } from '../../redux/profileReducer';
import { Profile } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import ChangeProfileInfoForm from '../Editors/ChangeProfileInfoForm';
import ChangePasswordForm from '../Editors/ChangePasswordForm';
import SignOut from '../Editors/SignOut';
import ChangeAvatarForm from '../Editors/ChangeAvatarForm';
import Menu from './Menu';
import { useTouchEvents } from 'hooks/useTouchEvents';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { Button, CustomImage } from 'common';
import Parameters from './Parameters';


type EditMode = "edit" | "changePassword" | "signOut" | "changeAvatar" | false

type ParametersList = ([string, (string | undefined | number | null)?])[]

type BlocksContainerStyle = { position?: "relative" }

type ShowMoreText = "Show more information" | "Hide more information"


const ProfilePanel = () => {
   const dispatch = useAppDispatch();
   const editIcons: string[] = [
      "./icons/showPasswordIcon.svg",
      "./icons/hidePasswordIcon.svg"
   ]

   const [editIconsLoaded, setEditIconsLoaded] = useState<boolean>(false)
   const [showMenuOnTouchStart, setShowMenuOnTouchStart] = useState<boolean>(true);
   const [editMode, setEditMode] = useState<EditMode>(false);
   const [pagePartEditClass, setPagePartEditClass] = useState<string>("");
   const profileInfo: Profile = useAppSelector(getProfileInfo);
   const profileInfoMode: string = useAppSelector(getProfileInfoMode);
   const parameterBlocks: ParametersList[] = [
      [
         ["Personal information"],
         ["location", profileInfo.location],
         // ["dateOfBirth", profileInfo.dateOfBirth],
         // ["education", profileInfo.education],
         ["dateOfBirth", "December 23, 1999"],
         ["education", "NSTU"],
         ["email", profileInfo.email],
      ],
      [
         ["Profile information"],
         ["friends", 0],
         ["communities", 0],
         ["posts", 0]
      ]
   ];
   const menu: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const personalParametersIcon: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const [showMore, setShowMore] = useState<boolean>(false);
   const [blocksContainerStyle, setBlocksContainerStyle] = useState<BlocksContainerStyle>({});
   const [showMoreText, setShowMoreText] = useState<ShowMoreText>("Show more information");

   // custom hooks
   const popupMenu: Popup = usePopupElement(menu, true);
   const touchMove = useTouchEvents('touchmove', [".profilePanelMenuElement"], resetShowMenuOnTouchEvent);
   const touchStart = useTouchEvents('touchstart', [".profilePanelMenuElement"], resetShowMenuOnTouchEvent);


   // effects
   useEffect(() => {
      if (editMode) {
         dispatch(profileActions.setProfileInfoMode("edit"));
      }
      return () => {
         dispatch(profileActions.setProfileInfoMode("view"));
      }
   }, [editMode]);

   useEffect(() => {
      if (profileInfoMode === "edit") {
         setPagePartEditClass(styles.pagePartEditClass);
      } else {
         setPagePartEditClass("");
      }
   }, [profileInfoMode]);

   useEffect(() => {
      if (showMore) {
         setBlocksContainerStyle({ position: "relative" })
         setShowMoreText("Hide more information")
      } else {
         setBlocksContainerStyle({})
         setShowMoreText("Show more information")
      }
   }, [showMore])


   // funcs
   const showMoreClickListener = () => {
      if (showMore) {
         setShowMore(false)
      } else {
         setShowMore(true)
      }
   }

   const addTouchEventListeners = (): void => {
      touchMove.removeEventListener();
      touchMove.addEventListener();
      touchStart.removeEventListener();
      touchStart.addEventListener();
   }

   const enableTouchEventsSimulation = (): void => {
      touchMove.enableEventSimulation();
      touchStart.enableEventSimulation();
   }

   function resetShowMenuOnTouchEvent(): void {
      popupMenu.hideElementWithTimeout(0);
      setShowMenuOnTouchStart(true);
   }

   const finishEditing: () => void = () => setEditMode(false);

   const showMenu = (): void => {
      popupMenu.showElementWithTimeout(200);
      setShowMenuOnTouchStart(false);
   }

   const hideMenu = (): void => {
      popupMenu.hideElementWithTimeout(200);
      setShowMenuOnTouchStart(true);
      enableTouchEventsSimulation();
   }

   const showMenuOnTouch = (): void => {
      popupMenu.showElementWithTimeout(0);
      setShowMenuOnTouchStart(false);
      addTouchEventListeners();
   }

   const hideMenuOnTouch = (): void => {
      popupMenu.hideElementWithTimeout(0);
      setShowMenuOnTouchStart(true);
      enableTouchEventsSimulation();
   }

   const menuIconTouchListener = (): void => {
      if (showMenuOnTouchStart) {
         showMenuOnTouch();
      } else {
         hideMenuOnTouch();
      }
   }


   return (
      <div className={`${styles.profilePanel} ${pagePartEditClass} pagePart`}>
         <div className={styles.panelGridContainer}>
            <CustomImage
               additionalClass={styles.avatar}
               src={profileInfo.avatar ? profileInfo.avatar : "./image/defaultAvatar.jpg"}
               onClick={() => setEditMode("changeAvatar")}
            />
            <div className={styles.header}>
               <h3 className={styles.username}>
                  {profileInfo.username}
               </h3>
               <div
                  className={`${styles.parametersIcon} profilePanelMenuElement unselectable`}
                  ref={personalParametersIcon}
                  onMouseEnter={showMenu}
                  onMouseLeave={hideMenu}
                  onTouchStart={menuIconTouchListener}
               >
                  <img src="./icons/other.svg" alt="Set personalParameters icon" />
               </div>
               {
                  popupMenu.needToShowElement
                     ? (
                        <Menu
                           hideMenu={hideMenu}
                           popupMenu={popupMenu}
                           menuRef={menu}
                           setEditMode={setEditMode}
                           showMenu={showMenu}
                           hideMenuOnTouchStart={resetShowMenuOnTouchEvent}
                        />
                     )
                     : null
               }
            </div>
            <Button
               params={
                  {
                     text: showMoreText,
                     clickHandler: showMoreClickListener,
                     containerClassName: styles.showMoreButtonContainer,
                     buttonClassName: styles.showMoreButton
                  }
               }

            />
            <div className={styles.profileInfo}>
               <div className={styles.parameterBlocksContainer} style={blocksContainerStyle}>
                  {parameterBlocks.map(block => <Parameters key={block[0][0]} parameters={block.slice(1)} title={block[0][0]} />)}
               </div>
            </div>
         </div>
         {
            editMode === "edit"
               ? <ChangeProfileInfoForm finishEditing={finishEditing} />
               : (editMode === "changePassword") && editIconsLoaded
                  ? <ChangePasswordForm finishEditing={finishEditing} />
                  : editMode === "signOut"
                     ? <SignOut finishEditing={finishEditing} />
                     : editMode === "changeAvatar"
                        ? <ChangeAvatarForm finishEditing={finishEditing} />
                        : null
         }
         <IconsThatAreLoaded
            icons={editIcons}
            setIconsLoaded={setEditIconsLoaded}
         />
      </div >
   )
}

export default ProfilePanel