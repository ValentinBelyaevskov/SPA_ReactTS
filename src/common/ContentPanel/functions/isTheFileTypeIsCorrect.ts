export const isTheFileTypeIsCorrect = (imageFile: File, type: "image" | "video" | "text"): boolean => {
   const fileType: string = imageFile.type;
   const typeLength: number = imageFile.type.indexOf("/");
   const fileShortenType: string = fileType.slice(0, typeLength);

   return fileShortenType === type ? true : false;
};
