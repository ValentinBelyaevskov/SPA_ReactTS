import styles from './Wall.module.scss'


type Props = {
}


const Wall = (props: Props) => {
   return (
      <div className={`${styles.wall} pagePart`}>
         <div className={styles.content}>
            Wall
         </div>
      </div>
   )
}

export default Wall