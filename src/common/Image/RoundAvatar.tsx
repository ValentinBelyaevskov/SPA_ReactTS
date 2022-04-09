import styles from "./RoundAvatar.module.scss"
import { ImageProps } from './types';


// * в style указать width и padding
const Avatar = (props: ImageProps) => {
   return (
      <div
         className={`${styles.avatar}
         ${props.additionalClass}`}
         style={
            (props.width || props.width)
               ? {
                  width: props.width ? props.width : "40px",
                  padding: props.width ? `0  0 ${props.height} 0` : "0 0 40px 0",
                  ...props.wrapperStyle
               }
               : {}
         }
      >
         <img
            src={props.src}
            alt="avatar" style={props.imgStyle}
            onLoad={props.onLoad ? props.onLoad : () => { }}
         />
      </div>
   )
}

export default Avatar