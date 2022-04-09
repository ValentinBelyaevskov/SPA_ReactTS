import styles from "./RoundAvatar.module.scss"
import { ImageProps } from './types';


// * в style указать width и padding
const Avatar = (props: ImageProps) => {
   return (
      <div className={`${styles.avatar} ${props.additionalClass}`} style={{
         width: props.width ? props.width : "50px",
         padding: props.height ? `0  0 ${props.height} 0` : "0 0 50px 0",
         ...props.wrapperStyle
      }}>
         <img
            src={props.src}
            alt="avatar" style={props.imgStyle}
            onLoad={props.onLoad ? props.onLoad: () => {}}
         />
      </div>
   )
}

export default Avatar