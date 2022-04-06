import styles from './SearchForm.module.scss'
import { useState, useEffect } from 'react';


type Props = {
   setSearchFormLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

type FormStyle = {
   display?: "none"
}


const SearchForm = (props: Props) => {
   // consts
   const [formStyle, setFormStyle] = useState<FormStyle>({ display: 'none' });
   const [searchIconHasBeenLoaded, setSearchIconHasBeenLoaded] = useState<boolean>(false)

   // effects
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