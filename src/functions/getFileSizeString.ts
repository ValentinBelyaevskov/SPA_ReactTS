type FileSize = "MB" | "KB" | "B"


export const getFileSizeString = (bytes: number): string => {

   const absoluteSizeArr: [number, FileSize] = (bytes > (10 ** 5))
      ? [bytes * (10 ** (-6)), "MB"]
      : (bytes > 100 && bytes < (10 ** 5))
         ? [bytes * (10 ** (-3)), "KB"]
         : [bytes, "B"];

   return `${Math.ceil(absoluteSizeArr[0] * 100) / 100} ${absoluteSizeArr[1]}`;
}