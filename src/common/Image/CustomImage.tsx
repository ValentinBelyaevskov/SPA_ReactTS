import styles from "./CustomImage.module.css"
import { ImageProps } from './types';


// * в style указать width и height
const CustomImage = (props: ImageProps) => {
   return (
      <div
         className={`${styles.image} ${props.additionalClass}`}
         style={
            (props.width || props.width)
               ? {
                  width: props.width ? props.width : "150px",
                  padding: props.width ? `0  0 ${props.height} 0` : "0 0 150px 0",
                  ...props.wrapperStyle
               }
               : { ...props.wrapperStyle }
         }
         ref={props.wrapperRef}
         onClick={props.onClick ? props.onClick : () => { }}
         onMouseEnter={props.onMouseEnter ? props.onMouseEnter : () => { }}
         onMouseLeave={props.onMouseLeave ? props.onMouseLeave : () => { }}
         onTouchStart={props.onTouchStart ? props.onTouchStart : () => { }}
         onTouchEnd={props.onTouchEnd ? props.onTouchEnd : () => { }}
      >
         {
            props.jsx ?
               props.jsx
               : null
         }
         <img
            src={props.src}
            ref={props.imageRef}
            className={props.additionalImageClass}
            alt="image"
            style={props.imgStyle}
            onLoad={props.onLoad ? props.onLoad : () => { }}
         />
      </div>
   )
}

export default CustomImage