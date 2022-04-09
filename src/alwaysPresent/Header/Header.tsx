import styles from './Header.module.scss'
import { useState, useEffect, useContext } from 'react';
import Controls from 'alwaysPresent/Controls/Controls';
import SearchForm from './SearchForm';
import { RoundAvatar } from 'common';
import { useAppSelector } from '../../hooks/redux';
import { getProfileInfo } from '../../pages/Profile/redux/profileReducer';
import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded';
import { ControlsContext } from 'App';


type Props = {
}

type HeaderElementStyle = { display?: "none" }


const Header = (props: Props) => {
   // vars
   const context = useContext(ControlsContext);

   const burgerIconsList: string[] = [
      "./icons/burger.svg",
      "./icons/hide.svg",
   ];
   const [burgerIconsLoaded, setBurgerIconsLoaded] = useState<boolean>(false);
   const profileInfo = useAppSelector(getProfileInfo)
   const [searchFormLoaded, setSearchFormLoaded] = useState<boolean>(false);
   const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false);
   const [headerStyle, setHeaderStyle] = useState<HeaderElementStyle>({ display: 'none' });


   // effects
   useEffect(() => {
      if (burgerIconsLoaded && context.controlsLoaded && searchFormLoaded && avatarLoaded) {
         setHeaderStyle({});
      } else {
         setHeaderStyle({ display: 'none' });
      }
   }, [burgerIconsLoaded, context.controlsLoaded, searchFormLoaded, avatarLoaded]);


   return (
      <div className={styles.header} style={headerStyle}>
         <div className={styles.searchForm}>
            <SearchForm setSearchFormLoaded={setSearchFormLoaded} />
         </div>
         <div className={styles.controls}>
            <Controls />
         </div>
         <div
            className={`${styles.burgerIcon} headerControlsElement unselectable`}
            onClick={() => {
               context.burgerIconClickListener!(context.needToShowControls!)
            }}
         >
            <img src={context.icon} alt="burger menu icon" />
         </div>
         <RoundAvatar
            additionalClass={styles.avatar}
            src={profileInfo.avatar}
            onLoad={() => setAvatarLoaded(true)}
         />
         <IconsThatAreLoaded
            icons={burgerIconsList}
            setIconsLoaded={setBurgerIconsLoaded}
         />
      </div>
   )
}

export default Header