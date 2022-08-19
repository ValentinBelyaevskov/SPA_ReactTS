import { getFileSizeString } from "functions/getFileSizeString";
import { useEffect, useState } from "react";




export type FilesItem = {
   type: string
   name?: string
   src?: string
   file?: File
   size?: number
}




export const useFilesBlock = () => {
   const [files, setFiles] = useState<FilesItem[]>([]);
   const [filesBlockStyle, setFilesBlockStyle] = useState<{ marginTop?: string }>({});




   const addFile = (file: File | null, callback: () => void): void => {
      if (file) {
         const fileObj: FilesItem = {
            name: file.name,
            file,
            type: file.type,
            src: URL.createObjectURL(file),
            size: file.size
         }

         console.log(`${getFileSizeString(file.size)} MB`);

         setFiles([...files, fileObj]);
      }

      callback();
   }

   const deleteFile = (index: number): void => {
      setFiles(files.filter((item, i) => i !== index));
   }

   const resetFilesBlock = (): void => {
      setFiles([])
   }




   useEffect(() => {
      if (files.length) {
         setFilesBlockStyle({ marginTop: "15px" });
      } else {
         setFilesBlockStyle({});
      }
   }, [files.length])




   return {
      files,
      setFiles,
      filesBlockStyle,
      addFile,
      deleteFile,
      resetFilesBlock
   }
}