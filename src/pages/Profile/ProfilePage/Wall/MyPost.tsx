import { Post } from 'pages/Profile/types/types'
import { useEffect } from 'react'
import styles from './Post.module.scss'



type Props = {
   id: string
   entity: Post
}



const MyPost = (props: Props) => {
   



   useEffect(() => {
      console.log("entity: ", props.entity);
   }, [props.id])



   return (
      <div className={styles.post}>

      </div>
   )
}



export default MyPost