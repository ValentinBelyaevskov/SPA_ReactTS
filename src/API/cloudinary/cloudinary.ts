import { digestMessage } from './../../functions/digestMessage';
import Backendless from 'backendless';


// types
interface Cloud {
   apiKey: string,
   apiSecret: string,
   url: string,

   uploadImage(file: File, objectId: string): Promise<string>

   deleteImage(public_id: string): Promise<void | string>
}

type ImageObj = { secure_url: string }

type DestroyResult = {
   result: string
}

type DeleteBodyObj = {
   public_id: string
   timestamp: number
   api_key: string
   signature: string
   invalidate: boolean
}


// classes
class Cloudinary implements Cloud {
   readonly apiKey: string = "197264174292373"
   readonly apiSecret: string = "SLK-l7nNhWw4wO1LRrwig2C4Mkw"
   readonly url: string = "https://api.cloudinary.com/v1_1/studentnsk/image/"
   protected unsignedUploadReset: string = "b0fwp4n7"
   protected signedUploadReset: string = "ml_default"

   constructor() {
   }

   async uploadImage(file: File, objectId: string): Promise<string> {
      try {
         const optimizationFormData: FormData = new FormData();
         const url: string = this.url + "upload";
         optimizationFormData.append("file", file);
         optimizationFormData.append("upload_preset", this.unsignedUploadReset);

         const response: Response = await fetch(url, {
            method: "POST",
            body: optimizationFormData,
         })

         const imageObj: ImageObj = await response.json()

         Backendless.UserService.update({ objectId: objectId, avatar: imageObj.secure_url });

         console.log(imageObj)
         return imageObj.secure_url;

      } catch (err: any) {
         console.log("Cloudinary uploadImage error")
         return (err.message)
      }
   }

   async deleteImage(public_id: string): Promise<void | string> {
      try {
         const invalidate: "true" | "false" = "true"
         const timestamp: number = Math.floor(new Date().getTime() / 1000)
         const publicId: string = "avatars/" + public_id
         const signatureStr: string = `invalidate=${invalidate}&public_id=${publicId}&timestamp=${timestamp}${this.apiSecret}`
         console.log(signatureStr)
         const signature: string = await digestMessage(signatureStr);

         const url: string = this.url + "destroy"
         const deleteBodyObj: DeleteBodyObj = {
            public_id: publicId,
            timestamp,
            api_key: this.apiKey,
            signature,
            invalidate: true,
         }

         const response: Response = await fetch(url, {
            method: "POST",
            headers: {
               'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(deleteBodyObj),
         })

         const result: DestroyResult = await response.json()

         console.log(result)

      } catch (err: any) {
         console.log(err.message)
         return (err.message)
      }
   }
}

export const cloudinary: Cloud = new Cloudinary()