import styles from "./PostImage.module.css"
import { ImageProps } from "./types"


// * в style указать width и padding
const PostImage = (props: ImageProps) => {
   return (
      <div className={`${styles.postImage} ${props.additionalClass}`} style={props.wrapperStyle}>
         <img src={props.src} alt="Post image" style={props.imgStyle} />
      </div>
   )
}

export default PostImage