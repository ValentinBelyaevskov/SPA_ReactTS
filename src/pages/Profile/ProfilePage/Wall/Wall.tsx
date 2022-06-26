import { useAppSelector } from 'hooks/redux'
import styles from './Wall.module.scss'
import { getPostIds, getPostEntities } from '../../redux/profileReducer';
import { useEffect } from 'react';
import MyPost from './MyPost';


type Props = {
}


const Wall = (props: Props) => {
   const postIds = useAppSelector(getPostIds);
   const postEntities = useAppSelector(getPostEntities);




   return postIds.length > 0
      ? (
         <div className={`${styles.wall} pagePart`}>
            <div className={styles.content}>
               {
                  postIds.map(id => (
                     <MyPost key={id} id={id} entity={postEntities[id]} />
                  ))
               }
            </div>
         </div>
      )
      : <></>
}



export default Wall