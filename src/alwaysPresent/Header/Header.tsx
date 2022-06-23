import styles from './Header.module.scss';
import appStyles from '../../App.module.scss';
import { useState, useEffect, useContext } from 'react';
import Controls from 'alwaysPresent/Controls/Controls';
import SearchForm from './SearchForm';
import { RoundAvatar } from 'common';
import { useAppSelector } from '../../hooks/redux';
import { getProfileInfo, getLoadInfo, getProfileMode } from '../../pages/Profile/redux/profileReducer';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { PopupControlsContext } from 'App';
import { useDropdownHeader } from 'hooks/Header/useDropdownHeader';
import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import GeneralPlayerInterface from 'common/GeneralPlayerInterfaces/GeneralPlayerInterface';



type Props = {
   appRef: React.RefObject<HTMLDivElement>
   headerContainerRef: React.RefObject<HTMLDivElement>
}

type HeaderElementStyle = { display?: "none" }



const Header = (props: Props) => {
   const popupContext = useContext(PopupControlsContext);
   const burgerIconsList: string[] = [
      "./icons/burger.svg",
      "./icons/hide.svg",
      "./image/defaultAvatar.jpg"
   ];
   const [burgerIconsLoaded, setBurgerIconsLoaded] = useState<boolean>(false);
   const profileInfo = useAppSelector(getProfileInfo);
   const profileMode = useAppSelector(getProfileMode);
   const loadInfo = useAppSelector(getLoadInfo);
   const [userAvatar, setUserAvatar] = useState<string>(profileInfo.avatar);
   const [searchFormLoaded, setSearchFormLoaded] = useState<boolean>(false);
   const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false);
   const [headerStyle, setHeaderStyle] = useState<HeaderElementStyle>({ display: 'none' });
   const burgerIconHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);



   const burgerClickListener = () => {
      burgerIconHoverAndTouchClassNames.clickListener();
      if (loadInfo.loaded && (profileMode === 'loggedIn')) popupContext.popupSwitcherlickListener!(popupContext.needToShowPopup!)
   }



   useDropdownHeader(popupContext.needToShowPopup!, props.headerContainerRef.current!, props.appRef.current!);

   useEffect(() => {
      if (burgerIconsLoaded && popupContext.popupLoaded && searchFormLoaded && avatarLoaded) {
         setHeaderStyle({});
      } else {
         setHeaderStyle({ display: 'none' });
      }
   }, [burgerIconsLoaded, popupContext.popupLoaded, searchFormLoaded, avatarLoaded]);

   useEffect(() => {
      if (profileMode !== "loggedIn") {
         setUserAvatar("./image/defaultAvatar.jpg")
      } else if (profileInfo.avatar && profileInfo.avatar.length) {
         setUserAvatar(profileInfo.avatar)
      }
   }, [profileMode, profileInfo.avatar])



   return (
      <div className={appStyles.headerContainer} ref={props.headerContainerRef}>
         <div className={styles.header} style={headerStyle}>
            <div className={styles.searchForm}>
               <SearchForm setSearchFormLoaded={setSearchFormLoaded} />
            </div>
            {
               <GeneralPlayerInterface styles={styles} />
            }
            <div className={styles.controls}>
               <Controls />
            </div>
            <div
               className={`${styles.burgerIcon} ${burgerIconHoverAndTouchClassNames.className} headerControlsElement unselectable`}
               onClick={burgerClickListener}
               onMouseEnter={burgerIconHoverAndTouchClassNames.mouseEnterListener}
               onTouchStart={burgerIconHoverAndTouchClassNames.touchStartListener}
               onTouchEnd={burgerIconHoverAndTouchClassNames.touchEndListener}
            >
               <img src={popupContext.icon} alt="burger menu icon" />
            </div>
            <RoundAvatar
               additionalClass={styles.avatar}
               src={userAvatar}
               onLoad={() => setAvatarLoaded(true)}
            />
            <IconsThatAreLoaded
               icons={burgerIconsList}
               setIconsLoaded={setBurgerIconsLoaded}
            />
         </div>
      </div>
   )
}

export default Header