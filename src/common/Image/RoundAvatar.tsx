import styles from "./RoundAvatar.module.css"
import { ImageProps } from './types';


// * в style указать width и padding
const Avatar = (props: ImageProps) => {
   return (
      <div className={`${styles.avatar} ${props.additionalClass}`} style={props.wrapperStyle}>
         <img src={props.src} alt="avatar" style={props.imgStyle} />
      </div>
   )
}

export default Avatar