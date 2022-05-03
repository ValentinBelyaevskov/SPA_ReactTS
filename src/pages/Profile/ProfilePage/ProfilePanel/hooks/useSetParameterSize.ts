import { useWindowSize } from 'hooks/useWindowSize';
import { useEffect, useState } from 'react';



export const useSetParameterSize = () => {
   const resize = useWindowSize("resize");
   const [maxParameterWidth, setMaxParameterWidth] = useState<number>(235);
   const [maxParameterLength, setMaxParameterLength] = useState<number>(19);



   useEffect(() => {
      // console.log(resize.value)
   }, [resize.value])

   useEffect(() => {
      resize.addEventListener();

      return () => {
         resize.removeEventListener();
      }
   }, []);


   useEffect(() => {
      if ((resize.value[0] > 550) && (maxParameterWidth !== 235) && (maxParameterLength !== 19)) {
         // console.log("setMaxParameterWidth(235)")
         setMaxParameterWidth(235);
         setMaxParameterLength(19);
      } else if ((resize.value[0] > 500 && resize.value[0] <= 550) && (maxParameterWidth !== 185) && (maxParameterLength !== 15)) {
         // console.log("setMaxParameterWidth(185)")
         setMaxParameterWidth(185);
         setMaxParameterLength(15);
      } else if ((resize.value[0] > 460 && resize.value[0] <= 500) && (maxParameterWidth !== 125) && (maxParameterLength !== 11)) {
         // console.log("setMaxParameterWidth(125)")
         setMaxParameterWidth(125);
         setMaxParameterLength(11);
      } else if ((resize.value[0] <= 460 && resize.value[0] > 400) && (maxParameterWidth !== 245) && (maxParameterLength !== 17)) {
         // console.log("setMaxParameterWidth(245)")
         setMaxParameterWidth(245);
         setMaxParameterLength(17);
      } else if ((resize.value[0] <= 400 && resize.value[0] > 355) && (maxParameterWidth !== 200) && (maxParameterLength !== 14)) {
         // console.log("setMaxParameterWidth(200)")
         setMaxParameterWidth(200);
         setMaxParameterLength(14);
      } else if ((resize.value[0] <= 355 && resize.value[0] >= 320) && (maxParameterWidth !== 165) && (maxParameterLength !== 11)) {
         // console.log("setMaxParameterWidth(165)")
         setMaxParameterWidth(165);
         setMaxParameterLength(11);
      } else if ((resize.value[0] < 320) && (maxParameterWidth !== 125) && (maxParameterLength !== 8)) {
         // console.log("setMaxParameterWidth(125)")
         setMaxParameterWidth(125);
         setMaxParameterLength(8);
      }
   }, [resize.value[0], maxParameterWidth, maxParameterLength]);



   return {
      maxParameterWidth,
      maxParameterLength
   }
}