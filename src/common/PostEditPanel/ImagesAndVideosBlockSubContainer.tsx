import { GridContainerStyle, GridDirection, ImagesAndVideosItem } from "./hooks/usePostImagesAndVideosBlock"
import styles from './ImagesAndVideosBlockContainer.module.scss'
import PostImage from "./PostImage"



type Props = {
   imagesAndVideos: ImagesAndVideosItem[]
   deleteImageOrVideo: (index: number) => void
   gridDirection: GridDirection
   subContainerStyle: GridContainerStyle
   containerSizes: [number, number]
   arrLength: number
   previosArrLength: number
}



const ImagesAndVideosBlockSubContainer = (props: Props) => {
   return (
      <div
         className={`${styles.subContainer} ${styles[props.gridDirection]}`}
         style={props.subContainerStyle}
      >
         {
            props.imagesAndVideos.map((item, index) => (
               <PostImage
                  sizes={item.sizes!}
                  key={item.src}
                  src={item.src!}
                  index={index + props.previosArrLength}
                  deleteImageOrVideo={props.deleteImageOrVideo}
                  type={item.type}
                  arrLength={props.arrLength}
                  containerSizes={props.containerSizes}
                  gridDirection={props.gridDirection}
               />
            ))
         }
      </div>
   )
}

export default ImagesAndVideosBlockSubContainer