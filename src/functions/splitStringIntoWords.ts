export const splitStringIntoWords = (string: string, toUpperCase: boolean = false): string => {
   const stringArr: string[] = []

   let i: number = 0

   string.split("").forEach((item: string, index: number) => {
      if (item === item.toUpperCase() && index) {
         ++i
      }
      stringArr[i] = (index && stringArr[i])
         ? stringArr[i] + item
         : (
            (toUpperCase && !index)
               ? item.toUpperCase()
               : item.toLowerCase()
         );
   })

   return stringArr.join(" ")
}