import styles from './BurgerIcons.module.scss'


type Props = {
   setBurgerIconLoaded: React.Dispatch<React.SetStateAction<boolean>>
   setHideIconLoaded: React.Dispatch<React.SetStateAction<boolean>>
}


const BurgerIcons = (props: Props) => {
   return (<div className={styles.iconLoadingContainer}>
      <img
         src="./icons/hide.svg"
         alt="burger menu icon"
         onLoad={() => { props.setBurgerIconLoaded(true) }}
      />
      <img
         src="./icons/burger.svg"
         alt="burger menu icon"
         onLoad={() => { props.setHideIconLoaded(true) }}
      />
   </div>)
}

export default BurgerIcons