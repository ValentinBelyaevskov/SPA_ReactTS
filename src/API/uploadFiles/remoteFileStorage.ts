import { digestMessage } from '../../functions/digestMessage';
import Backendless from 'backendless';
import { convertFileSizeToMb } from 'functions/convertFileSizeToMB';




// types
interface Cloud {
   apiKey: string,
   apiSecret: string,
   imageUrl: string,

   uploadAvatar(file: File, objectId: string): Promise<string>

   uploadImagesAndVideos(files: File[]): Promise<string[]>

   uploadAudios(files: File[]): Promise<string[]>

   deleteFiles(public_id: string[]): Promise<void | string>
}

type ImageObj = { secure_url: string }

type DeleteBodyObj = {
   public_id: string
   timestamp: number
   api_key: string
   signature: string
   invalidate: boolean
}




class RemoteFileStorage implements Cloud {
   readonly apiKey: string = "197264174292373";
   readonly apiSecret: string = "SLK-l7nNhWw4wO1LRrwig2C4Mkw";
   readonly imageUrl: string = "https://api.cloudinary.com/v1_1/studentnsk/image/";
   readonly videoUrl: string = "https://api.cloudinary.com/v1_1/studentnsk/video/";
   protected avatarsPreset: string = "avatarsPreset";
   protected imagesAndVideosPreset: string = "imagesAndVideosPreset";
   protected imagesAndVideosPresetEco: string = "imagesAndVideosPresetEco";
   protected audiosPreset: string = "audiosPreset";
   protected filesPreset: string = "filesPreset";

   constructor() {
   }

   // * avatar
   async uploadAvatar(file: File, userObjectId: string): Promise<string> {
      try {
         const optimizationFormData: FormData = new FormData();
         const url: string = this.imageUrl + "upload";
         optimizationFormData.append("file", file);
         optimizationFormData.append("upload_preset", this.avatarsPreset);

         const response: Response = await fetch(url, {
            method: "POST",
            body: optimizationFormData,
         })

         const imageObj: ImageObj = await response.json();

         Backendless.UserService.update({ objectId: userObjectId, avatar: imageObj.secure_url });

         return imageObj.secure_url;

      } catch (err: any) {
         console.log("Cloudinary uploadAvatar error");
         return (err.message);
      }
   }

   // * images
   async uploadImagesAndVideos(files: File[]): Promise<string[]> {
      try {
         if (files.length === 0) return [];

         const savedFiles: string[] = await Promise.all(files.map(async (file) => {
            const optimizationFormData: FormData = new FormData();
            let size: "normal" | "big" = "normal";

            const typeUrl: string | undefined = (
               file.type.includes("image")
                  ? this.imageUrl
                  : file.type.includes("video")
                     ? this.videoUrl
                     : undefined
            );



            if (file.type.includes("image")) {
               if (
                  convertFileSizeToMb(file.size) > 5
                  && convertFileSizeToMb(file.size) < 10
               ) {
                  size = "big";
               } else if (convertFileSizeToMb(file.size) > 10) {
                  throw new Error("Image size should not exceed 10mb");
               }

            } else if (file.type.includes("video")) {
               if (convertFileSizeToMb(file.size) > 15) {
                  size = "big";
               } else if (convertFileSizeToMb(file.size) > 20) {
                  throw new Error("Image size should not exceed 10mb");
               }
            }


            if (!typeUrl) {
               throw new Error("The file is not a video or image");
            }



            const url: string = typeUrl + "upload";

            optimizationFormData.append("file", file);

            if (size === 'big') {
               optimizationFormData.append("upload_preset", this.imagesAndVideosPresetEco);
            } else if (size === 'normal') {
               optimizationFormData.append("upload_preset", this.imagesAndVideosPreset);
            }


            const response: Response = await fetch(url, {
               method: "POST",
               body: optimizationFormData,
            })

            const imageObj: ImageObj = await response.json();

            return imageObj.secure_url;
         }));



         return savedFiles;

      } catch (err: any) {
         console.log("Cloudinary uploadAvatar error");
         return (err.message);
      }
   }

   // * audios
   async uploadAudios(files: File[]): Promise<string[]> {
      try {
         if (files.length === 0) return [];

         const savedFiles: string[] = await Promise.all(files.map(async (file) => {
            const optimizationFormData: FormData = new FormData();

            const url: string = this.videoUrl + "upload";

            optimizationFormData.append("file", file);
            optimizationFormData.append("upload_preset", this.audiosPreset);

            const response: Response = await fetch(url, {
               method: "POST",
               body: optimizationFormData,
            });

            const imageObj: ImageObj = await response.json();

            return imageObj.secure_url;
         }));



         return savedFiles;

      } catch (err: any) {
         console.log("Cloudinary uploadAvatar error");
         return (err.message);
      }
   }

   // * delete files
   async deleteFiles(public_ids: string[]): Promise<void | string> {
      try {
         public_ids.forEach(async (public_id) => {
            const invalidate: "true" | "false" = "true";
            const timestamp: number = Math.floor(new Date().getTime() / 1000);
            const publicId: string = "avatars/" + public_id;
            const signatureStr: string = `invalidate=${invalidate}&public_id=${publicId}&timestamp=${timestamp}${this.apiSecret}`;
            const signature: string = await digestMessage(signatureStr);

            const url: string = this.imageUrl + "destroy"
            const deleteBodyObj: DeleteBodyObj = {
               public_id: publicId,
               timestamp,
               api_key: this.apiKey,
               signature,
               invalidate: true,
            }

            await fetch(url, {
               method: "POST",
               headers: {
                  'Content-Type': 'application/json;charset=utf-8'
               },
               body: JSON.stringify(deleteBodyObj),
            })
         });

      } catch (err: any) {
         console.log(err.message);
         return (err.message);
      }
   }
}




export const remoteFileStorage: Cloud = new RemoteFileStorage()