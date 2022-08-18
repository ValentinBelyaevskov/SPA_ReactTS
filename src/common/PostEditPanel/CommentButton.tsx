import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames"
import { Post } from "pages/Profile/types/types"
import styles from "./CommentButton.module.scss"




type Props = {
    profileId: string
    post: Post
    gridAreaStyle: string
}




const CommentButton = (props: Props) => {
    const commentsHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);




    return (
        <div
            className={`${styles.commentButtonContainer} ${props.gridAreaStyle} ${commentsHoverAndTouchClassNames.className} unselectable`}
            onClick={commentsHoverAndTouchClassNames.clickListener}
            onMouseEnter={commentsHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={commentsHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={commentsHoverAndTouchClassNames.touchEndListener}
        >
            <div className={styles.commentIcon}>
                <img src="./icons/messagesActive.svg" />
            </div>
            <div className={styles.numberOfCommentsContainer}>
                <div className={styles.numberOfComments}>
                    {props.post.comments.length}
                </div>
            </div>
        </div>
    )
}




export default CommentButton