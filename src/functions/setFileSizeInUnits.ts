export const setFileSizeInUnits = (bytes: number): string => {
   let fileSize: number;
   let units: "B" | "KB" | "MB";


   if (bytes >= 0 && bytes < 10 ** 2) {
      fileSize = bytes;
      units = "B";
   } else if (bytes >= 10 ** 2 && bytes < 10 ** 5) {
      fileSize = bytes * (10 ** (-3));
      units = "KB";
   } else if (bytes >= 10 ** 5) {
      fileSize = bytes * (10 ** (-6));
      units = "MB";
   }


   return `${Math.ceil(fileSize! * 100) / 100}${units!}`;
}