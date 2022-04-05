import styles from './SearchForm.module.scss'


type Props = {
}


const SearchForm = (props: Props) => {
   return (
      <form className={styles.form}>
         <img className={styles.searchIcon} src="./icons/loupe.svg" alt="Search icon" />
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