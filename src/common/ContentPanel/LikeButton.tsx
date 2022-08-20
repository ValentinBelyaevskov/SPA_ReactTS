import { useAppDispatch, useAppSelector } from "hooks/redux"
import { useHoverAndTouchClassNames } from "hooks/useHoverAndTouchClassNames"
import { getProfileInfoMode, likeAPost, profileActions } from "pages/Profile/redux/profileReducer"
import { ClickResult, Post } from "pages/Profile/types/types"
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
    const [clickResult, setClickResult] = useState<ClickResult>("like");
    const dispatch = useAppDispatch();
    const profileInfoMode = useAppSelector(getProfileInfoMode);




    const buttonClickListener = (): void => {
        if (profileInfoMode === "contentChange") return;

        dispatch(profileActions.setProfileInfoMode("contentChange"));

        dispatch(likeAPost(
            {
                callback: () => dispatch(profileActions.setProfileInfoMode("pageView")),
                clickResult,
                likes: props.post.likes,
                profileId: props.profileId,
                postId: props.post.objectId
            }
        ))

        likesHoverAndTouchClassNames.clickListener();
        setThePostWasLiked(!thePostWasLiked);
    }




    useEffect(() => {
        if (props.post.likes.includes(props.profileId)) {
            setThePostWasLiked(true);
        } else {
            setThePostWasLiked(false)
        }
    }, [props.post.likes.length, props.profileId])


    useEffect(() => {
        if (props.post.likes.includes(props.profileId)) {
            setClickResult("cancelLike");
        } else {
            setClickResult("like");
        }
    }, [props.post.likes.length, props.profileId])


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