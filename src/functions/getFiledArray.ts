export const getFilledArray = <T>(value: T, length: number): T[] => {
   const arr = [];

   for (let i = 0; i < length; i++) {
      arr[i] = value;
   }

   return arr;
}