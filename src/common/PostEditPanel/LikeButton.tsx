import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames"
import { Post } from "pages/Profile/types/types"
import { useEffect, useState } from "react"
import styles from "./LikeButton.module.scss"




type Props = {
    profileId: string
    post: Post
    gridAreaStyle: string
}


// like, likeFilled

const LikeButton = (props: Props) => {
    const likesHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
    const [thePostWasLiked, setThePostWasLiked] = useState<boolean>(false);
    const [likeIcon, setLikeIcon] = useState<"./icons/like.svg" | "./icons/likeFilled.svg">("./icons/like.svg");




    const buttonClickListener = (): void => {
        console.log();
        likesHoverAndTouchClassNames.clickListener();
        setThePostWasLiked(!thePostWasLiked);
    }


    useEffect(() => {
        if (thePostWasLiked) {
            setLikeIcon("./icons/likeFilled.svg");
        } else {
            setLikeIcon("./icons/like.svg");
        }
    }, [thePostWasLiked]);




    return (
        <div
            className={`${styles.likeButtonContainer} ${props.gridAreaStyle} ${likesHoverAndTouchClassNames.className} unselectable`}
            onClick={buttonClickListener}
            onMouseEnter={likesHoverAndTouchClassNames.mouseEnterListener}
            onTouchStart={likesHoverAndTouchClassNames.touchStartListener}
            onTouchEnd={likesHoverAndTouchClassNames.touchEndListener}
        >
            <div className={styles.likeIcon}>
                <img src={likeIcon} />
            </div>
            <div className={styles.numberOfLikesContainer}>
                <div className={styles.numberOfLikes}>
                    {props.post.likes.length}
                </div>
            </div>
        </div>
    )
}




export default LikeButton