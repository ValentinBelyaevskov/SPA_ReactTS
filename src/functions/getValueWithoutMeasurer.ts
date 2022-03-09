const getValueWithoutMeasurer = (value: string): string => {
   let measureStr: string = ""

   value.split("").reverse().forEach((item: string, index: number) => {
      if (!+item && (item !== "." && item !== "0")) {
         measureStr = item + measureStr
      }
   })

   return value.slice(0, - (measureStr.length))
}

export default getValueWithoutMeasurer;