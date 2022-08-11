import { useAppSelector } from 'hooks/redux'
import { getPostsLoadInfo } from 'pages/Profile/redux/profileReducer'
import styles from './ErrorGettingPost.module.scss'




export const ErrorGettingPost = () => {
    const postsLoadInfo = useAppSelector(getPostsLoadInfo);


    return (
        <div className={`${styles.errorDescription} pagePart`}>
            {postsLoadInfo.error}
        </div>
    )
}