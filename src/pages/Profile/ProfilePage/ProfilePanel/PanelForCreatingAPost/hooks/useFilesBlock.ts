import { useEffect, useState } from "react";




export type FilesItem = {
   name?: string
   type?: string
   src?: string
   file?: File
   size?: number
}




export const useFilesBlock = () => {
   const [files, setFiles] = useState<FilesItem[]>([]);
   const [filesBlockStyle, setFilesBlockStyle] = useState<{ marginTop?: string }>({});




   const addFileSubmitListener = (file: File | null, callback: () => void): void => {
      if (file) {
         const fileObj: FilesItem = {
            name: file.name,
            file,
            type: file.type,
            src: URL.createObjectURL(file)
         }

         setFiles([...files, fileObj]);
      }

      callback();
   }

   const deleteFile = (index: number): void => {
      setFiles(files.filter((item, i) => i !== index));
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
      filesBlockStyle,
      addFileSubmitListener,
      deleteFile
   }
}