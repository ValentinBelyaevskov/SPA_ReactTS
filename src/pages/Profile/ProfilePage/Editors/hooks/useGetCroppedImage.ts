import { useState } from "react";
import { Crop, PixelCrop } from "react-image-crop";



export const useGetCroppedImage = () => {
   const [croppedImgSrc, setCroppedImgSrc] = useState<string>("");
   const [croppedImage, setCroppedImage] = useState<File | null>(null);
   const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
   const [crop, setCrop] = useState<Crop>();
   const [aspect, setAspect] = useState<number | undefined>(1 / 1);



   function getCroppedImage(sourceImage: HTMLImageElement, cropConfig: PixelCrop) {
      // creating the cropped image from the source image
      const canvas = document.createElement('canvas');
      const scaleX = sourceImage.naturalWidth / sourceImage.width;
      const scaleY = sourceImage.naturalHeight / sourceImage.height;
      canvas.width = cropConfig.width * scaleX;
      canvas.height = cropConfig.height * scaleY;
      const ctx = canvas.getContext('2d');

      if (ctx) {
         ctx.imageSmoothingQuality = "high";
         ctx.drawImage(
            sourceImage,
            cropConfig.x * scaleX,
            cropConfig.y * scaleY,
            cropConfig.width * scaleX,
            cropConfig.height * scaleY,
            0,
            0,
            cropConfig.width * scaleX,
            cropConfig.height * scaleY
         );
      }

      return new Promise<string>((resolve, reject) => {
         canvas.toBlob(
            (blob) => {
               // returning an error
               if (!blob) {
                  reject(new Error('Canvas is empty'));
                  return;
               }

               // creating a Object URL representing the Blob object given
               const croppedImageUrl = URL.createObjectURL(blob);
               const croppedImageFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });

               setCroppedImage(croppedImageFile);
               setCroppedImgSrc(croppedImageUrl);
               resolve(croppedImageUrl);
            }, 'image/jpeg',
            1
         );
      });
   }



   return {
      aspect,
      crop,
      setCrop,
      croppedImage,
      croppedImgSrc,
      completedCrop,
      setCompletedCrop,
      getCroppedImage
   }
}