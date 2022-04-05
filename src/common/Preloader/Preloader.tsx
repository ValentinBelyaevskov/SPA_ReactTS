import styles from './Preloader.module.scss'


// types
type Props = {
   containerStyle?: {
      [prop: string]: string
   }
}


const Preloader = (props: Props) => {
   return (
      <div className={styles.preloaderContainer} style={props.containerStyle}>
         <img src="./animatedIcons/preloader1.svg"/>
      </div>
   )
}

export default Preloader