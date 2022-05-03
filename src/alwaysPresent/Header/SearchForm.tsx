import styles from './SearchForm.module.scss'
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { getProfileMode } from 'pages/Profile/redux/profileReducer';


type Props = {
   setSearchFormLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

type FormStyle = {
   display?: "none"
}


const SearchForm = (props: Props) => {
   const profileMode = useAppSelector(getProfileMode)
   const [formStyle, setFormStyle] = useState<FormStyle>({ display: 'none' });
   const [searchIconHasBeenLoaded, setSearchIconHasBeenLoaded] = useState<boolean>(false)



   useEffect(() => {
      if (searchIconHasBeenLoaded) {
         setFormStyle({})
         props.setSearchFormLoaded(true)
      }

      return () => {
         setFormStyle({
            display: 'none'
         })
      }
   }, [searchIconHasBeenLoaded])



   return (
      <form className={styles.form} style={formStyle} >
         <img
            className={styles.searchIcon}
            onLoad={() => setSearchIconHasBeenLoaded(true)}
            src="./icons/loupe.svg" alt="Search icon"
         />
         <input
            disabled={profileMode === 'loggedIn' ? false: true}
            className={styles.searchInput}
            placeholder='Search'
            type="text"
         />
         <button
            type="submit"
            style={{ display: "none" }}
         >
         </button>
      </form>
   )
}

export default SearchForm