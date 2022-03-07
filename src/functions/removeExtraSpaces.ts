export const removeExtraSpaces = (string: string): string => {
   let wordArr: string[] = []
   let i: number = 0;
   string.split("").forEach((item, index, arr) => {
      if (item !== " ") {
         wordArr[i] = index
            ? arr[index - 1] !== " "
               ? wordArr[i] + item
               : item
            : item
      }

      if (item === " " && item !== arr[index - 1]) {
         i++
      }
   })

   return wordArr.join(" ")
}