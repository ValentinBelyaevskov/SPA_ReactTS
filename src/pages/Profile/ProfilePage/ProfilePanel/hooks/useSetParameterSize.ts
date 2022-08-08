import { useScrollOrWindowSize } from 'hooks/useScrollOrWindowSize';
import { useEffect, useState } from 'react';



export type ConfigForAdaptability = ([number | undefined, number | undefined, number, number])[];



export const useSetParameterSize = (config: ConfigForAdaptability) => {
   const resize = useScrollOrWindowSize("resize");
   const [maxParameterWidth, setMaxParameterWidth] = useState<number>(235);
   const [maxParameterLength, setMaxParameterLength] = useState<number>(19);



   useEffect(() => {
      resize.addEventListener();

      return () => {
         resize.removeEventListener();
      }
   }, []);


   useEffect(() => {
      config.forEach(item => {
         if (
            ((item[0] && resize.value[0] > item[0]) || (item[0] === undefined))
            && ((item[1] && resize.value[0] <= item[1]) || (item[1] === undefined))
            && (maxParameterWidth !== item[2])
            && (maxParameterLength !== item[3])
         ) {
            setMaxParameterWidth(item[2]);
            setMaxParameterLength(item[3]);
         }
      })
   }, [resize.value[0], maxParameterWidth, maxParameterLength, config.length]);



   return {
      maxParameterWidth,
      maxParameterLength
   }
}