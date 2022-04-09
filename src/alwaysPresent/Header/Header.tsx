import styles from './Header.module.scss'
import { useState, useEffect } from 'react';
import Controls from 'alwaysPresent/Controls/Controls';
import SearchForm from './SearchForm';
import { RoundAvatar } from 'common';
import { useAppSelector } from '../../hooks/redux';
import { getProfileInfo } from '../../pages/Profile/redux/profileReducer';


type Props = {
}

type HeaderElementStyle = { display?: "none" }


const Header = (props: Props) => {
   // vars
   const profileInfo = useAppSelector(getProfileInfo)
   const [controlsLoaded, setControlsLoaded] = useState<boolean>(false);
   const [searchFormLoaded, setSearchFormLoaded] = useState<boolean>(false);
   const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false);
   const [headerElementStyle, setHeaderElementStyle] = useState<HeaderElementStyle>({ display: 'none' });


   // effects
   useEffect(() => {
      if (controlsLoaded && searchFormLoaded && avatarLoaded) {
         setHeaderElementStyle({})
      } else {
         setHeaderElementStyle({ display: 'none' })
      }
   }, [controlsLoaded, searchFormLoaded, avatarLoaded])


   return (
      <div className={styles.header}>
         <div className={styles.searchForm} style={headerElementStyle}>
            <SearchForm setSearchFormLoaded={setSearchFormLoaded} />
         </div>
         <div className={styles.controls} style={headerElementStyle}>
            <Controls setControlsLoaded={setControlsLoaded} />
         </div>
         <RoundAvatar
            additionalClass={styles.avatar}
            width='32px'
            height='32px'
            src={profileInfo.avatar}
            wrapperStyle={headerElementStyle}
            onLoad={() => setAvatarLoaded(true)}
         />
      </div>
   )
}

export default Header