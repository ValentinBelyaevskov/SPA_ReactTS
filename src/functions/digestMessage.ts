export const digestMessage = async (message: string) => {
   const msgUint8: Uint8Array = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
   const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
   const hashArray: number[] = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
   const hashHex: string = hashArray.map((b: number) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
   return hashHex;
}