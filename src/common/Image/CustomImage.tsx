import styles from "./CustomImage.module.css"
import { ImageProps } from './types';


// * в style указать width и height
const CustomImage = (props: ImageProps) => {
   return (
      <div
         className={`${styles.image} ${props.additionalClass}`}
         style={{
               width: props.width ? props.width: "150px",
               height: props.height ? props.height: "150px",
               ...props.wrapperStyle
            }}
      >
         <img src={props.src} alt="image" style={props.imgStyle} />
      </div>
   )
}

export default CustomImage