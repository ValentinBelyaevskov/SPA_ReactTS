import { useEffect, useRef, useState } from 'react';
import styles from './Slider.module.scss'




type Props = {
   windowSize: [number, number]
   additionalClass?: string
   percentage: number
   reset?: boolean
   onChange: (value: number) => void
   showPlaylist?: boolean
}

type ThumbStyle = {
   left?: string,
   marginLeft?: string
}

type RangeStyle = {
   width?: string
}




const thumbHeight: number = 10;




const Slider = (props: Props) => {
   const rangeRef = useRef<HTMLInputElement>(null);
   const [thumbStyle, setThumbStyle] = useState<ThumbStyle>({});
   const [progressBarStyle, setProgressBarStyle] = useState<RangeStyle>({});




   const onRangeChange = (e: React.FormEvent) => {
      if (e.target instanceof HTMLInputElement) {
         props.onChange(+e.target.value);
      }
   }




   useEffect(() => {
      setThumbStyle({
         left: `${props.percentage}%`,
         marginLeft: `${(-thumbHeight / 100) * props.percentage}px`
      });
   }, [props.percentage, props.windowSize[0]])


   useEffect(() => {
      if (rangeRef.current && rangeRef.current instanceof HTMLInputElement) {
         const progressBarWidth = rangeRef.current.getBoundingClientRect().width;

         setProgressBarStyle({
            width: `${(progressBarWidth * props.percentage / 100) + ((1 - (props.percentage / 100)) * thumbHeight)}px`
         })
      }
   }, [props.percentage, rangeRef.current, props.windowSize[0], props.showPlaylist])




   return (
      <div className={`${styles.slider}  ${props.additionalClass ? props.additionalClass : null}`}>
         <div className={styles.progressBarCover} style={progressBarStyle} ></div>
         <div className={styles.thumb} style={thumbStyle}></div>
         <input
            className={styles.range}
            type="range"
            step='0.01'
            onChange={onRangeChange}
            ref={rangeRef}
            value={props.percentage ? props.percentage : 0}
         />
      </div>
   )
}




export default Slider