import styles from './Controls.module.scss'


// types
type Props = {
}


const Controls = (props: Props) => {
   const pagesList: string[] = [
      "Profile",
      "News",
      "Messages",
      "Friends",
      "Communities",
      "Settings",
   ]


   return (
      <div className={styles.controls}>
         <ul className={styles.controlsList}>
            {pagesList.map((item: string) => <li className={styles.controlsListItem}>{item}</li>)}
         </ul>
         <div className={styles.burger}>
            burger
         </div>
      </div>
   )
}

export default Controls