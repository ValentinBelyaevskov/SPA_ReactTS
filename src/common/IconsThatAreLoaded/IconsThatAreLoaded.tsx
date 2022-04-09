import styles from './IconsThatAreLoaded.module.scss'
import { useState, useEffect } from 'react';


type Props = {
   icons: string[],
   setIconsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}


export const IconsThatAreLoaded = (props: Props) => {
   // consts
   const iconsList: string[] = [...props.icons]
   const [iconsStatus, setIconsStatus] = useState<boolean[]>([false, false]);


   // effects
   useEffect(() => {
      if (!iconsStatus.includes(false)) {
         props.setIconsLoaded(true)
      }

      return () => {
         props.setIconsLoaded(false)
      }
   }, [iconsStatus])


   // funcs
   const setIconLoaded = (index: number) => {
      const newLoadedIconsArr = [...iconsStatus];
      newLoadedIconsArr[index] = true;
      setIconsStatus(newLoadedIconsArr);
   }


   return (
      <div className={styles.icons}>
         {iconsList.map((icon, index) => (
            <img key={icon} src={icon} onLoad={() => setIconLoaded(index)} />
         ))}
      </div>
   )
}