export const separatePatnAndName = (pathAndName: string): string[] => {
   const getDelimiterNumber = (word: string, delimiter: string): number => (
      word.split("").reverse().findIndex((item: string) => item === delimiter)
   )

   if (pathAndName.includes("/", 0)) {
      const fileNameLength: number = getDelimiterNumber(pathAndName, "/")
      const pathWithoutName: string = pathAndName.split("").slice(0, -fileNameLength - 1).join("")
      const nameWithoutPath: string = pathAndName.split("").slice(-fileNameLength).join("")

      const formatLength: number = getDelimiterNumber(nameWithoutPath, ".")
      const nameWithoutPathAndFormat: string = nameWithoutPath.split("").slice(0, -formatLength - 1).join("")
      const format: string = nameWithoutPath.split("").slice(-fileNameLength).join("")

      return [pathWithoutName, nameWithoutPathAndFormat, format]
   } else {
      return ["", pathAndName]
   }
}