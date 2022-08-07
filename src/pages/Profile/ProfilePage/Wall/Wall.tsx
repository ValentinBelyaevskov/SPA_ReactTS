import { useAppSelector } from 'hooks/redux'
import styles from './Wall.module.scss'
import { getPostIds, getPostEntities } from '../../redux/profileReducer';
import PostEditPanel from 'common/PostEditPanel/PostEditPanel';


type Props = {
}


const Wall = (props: Props) => {
   const postIds = useAppSelector(getPostIds);
   const postEntities = useAppSelector(getPostEntities);




   return postIds.length > 0
      ? (
         <>
            {
               postIds.map(id => (
                  <div key={id} className={`${styles.postContainer} pagePart`}>
                     <PostEditPanel
                        mode='view'
                        containerClassName={styles.post}
                        post={postEntities[id]}
                        audioPlayerContext={`post_${id}`}
                     />
                  </div>
               ))
            }
         </>
      )
      : <></>
}



export default Wall