import { IconsThatAreLoaded } from 'common/IconsThatAreLoaded/IconsThatAreLoaded'
import { useEffect, useState } from 'react';
import styles from './Preloader.module.scss'


// types
type Props = {
   containerStyle?: {
      [prop: string]: string
   }
}


const Preloader = (props: Props) => {
   const icons = [
      "./animatedIcons/preloader1.svg"
   ];
   const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);




   return (
      <div className={styles.preloaderContainer} style={props.containerStyle}>
         {
            iconsLoaded ?
               <img src="./animatedIcons/preloader1.svg" />
               : null
         }
         <IconsThatAreLoaded
            icons={icons}
            setIconsLoaded={setIconsLoaded}
         />
      </div>
   )
}

export default Preloader