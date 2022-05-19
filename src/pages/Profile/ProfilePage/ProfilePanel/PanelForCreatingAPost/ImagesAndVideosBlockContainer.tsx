import { useEffect, useState } from "react"
import { GridContainerStyle, GridDirection, PostImagesItem } from "./hooks/usePostImagesAndVideosBlock"
import ImagesAndVideosBlockSubContainer from "./ImagesAndVideosBlockSubContainer"
import styles from './PanelForCreatingAPost.module.scss'
import PostImage from "./PostImage"



type SubContainerStyles = {
   firstSubContainerStyle: GridContainerStyle,
   secondSubContainerStyle: GridContainerStyle,
   thirdSubContainerStyle: GridContainerStyle,
}

type Config = {
   imagesAndVideos: PostImagesItem[]
   deleteImageOrVideo: (index: number) => void
   gridDirection: GridDirection
   imagesAndVideosContainerStyle: GridContainerStyle
   fiveOrMoreItems: boolean
   subContainerStyles: SubContainerStyles
   containerWidth: number
}

type Props = {
   config: Config
}



const imagesContainerStyles = [
   "oneImg",
   "twoImgs",
   "threeImgs",
   "fourImgs",
   "fiveOrMoreImgs"
];



const ImagesAndVideosBlockContainer = (props: Props) => {
   const [imagesBlockArr, setImagesBlockArr] = useState<PostImagesItem[][]>([]);
   const config = props.config;
   const subContainerStyles = config.subContainerStyles;



   useEffect(() => {
      const horizontalDirectionImagesBlockArr = config.imagesAndVideos.length < 8
         ? [config.imagesAndVideos.slice(0, 2), config.imagesAndVideos.slice(2)]
         : config.imagesAndVideos.length < 10
            ? [config.imagesAndVideos.slice(0, 2), config.imagesAndVideos.slice(2, 5), config.imagesAndVideos.slice(5)]
            : [config.imagesAndVideos.slice(0, 2), config.imagesAndVideos.slice(2, 6), config.imagesAndVideos.slice(6)];

      const verticalDirectionImagesBlockArr = config.imagesAndVideos.length < 7
         ? [config.imagesAndVideos.slice(0, 1), config.imagesAndVideos.slice(1, 3), config.imagesAndVideos.slice(3)]
         : config.imagesAndVideos.length < 9
            ? [config.imagesAndVideos.slice(0, 1), config.imagesAndVideos.slice(1, 4), config.imagesAndVideos.slice(4)]
            : [config.imagesAndVideos.slice(0, 1), config.imagesAndVideos.slice(1, 5), config.imagesAndVideos.slice(5)];

      if (config.gridDirection === "horizontal") {
         setImagesBlockArr([...horizontalDirectionImagesBlockArr]);
      } else if (config.gridDirection === "vertical") {
         setImagesBlockArr([...verticalDirectionImagesBlockArr]);
      }
   }, [config.imagesAndVideos.length, config.gridDirection])



   return (
      <div
         className={`${styles.imagesContainer} ${config.fiveOrMoreItems ? styles.fiveOrMoreImgs : styles[imagesContainerStyles[config.imagesAndVideos.length - 1]]} ${styles[props.config.gridDirection]}`}
         style={config.imagesAndVideosContainerStyle}
      >{
            config.fiveOrMoreItems ?
               <>
                  {
                     imagesBlockArr.map((item, index) => (
                        <ImagesAndVideosBlockSubContainer
                           key={index}
                           imagesAndVideos={item}
                           previosArrLength={index? imagesBlockArr[index - 1].length: index}
                           arrLength={config.imagesAndVideos.length}
                           deleteImageOrVideo={config.deleteImageOrVideo}
                           gridDirection={config.gridDirection}
                           subContainerStyle={
                              index === 0
                                 ? subContainerStyles.firstSubContainerStyle
                                 : index === 1
                                    ? subContainerStyles.secondSubContainerStyle
                                    : subContainerStyles.thirdSubContainerStyle
                           }
                           containerWidth={config.containerWidth}
                        />
                     ))
                  }
               </>
               : props.config.imagesAndVideos.map((item, index) => (
                  <PostImage
                     key={item.src}
                     sizes={item.sizes!}
                     src={item.src!}
                     index={index}
                     deleteImageOrVideo={props.config.deleteImageOrVideo}
                     type={item.type}
                     arrLength={props.config.imagesAndVideos.length}
                     containerWidth={config.containerWidth}
                     gridDirection={config.gridDirection}
                  />
               ))
         }
      </div>
   )
}



export default ImagesAndVideosBlockContainer