import styles from "./CustomImage.module.css"
import { ImageProps } from './types';


// * в style указать width и height
const CustomImage = (props: ImageProps) => {
   return (
      <div
         className={`${styles.image} ${props.additionalClass}`}
         style={{
               width: props.width ? props.width: "150px",
               padding: props.height ? `0  0 ${props.height} 0`: "0 0 150px 0",
               ...props.wrapperStyle
            }}
         onClick={props.onClick ? props.onClick: () => {}}
      >
         <img src={props.src} alt="image" style={props.imgStyle} />
      </div>
   )
}

export default CustomImage