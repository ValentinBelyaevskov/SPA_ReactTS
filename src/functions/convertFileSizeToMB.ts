export const convertFileSizeToMb = (bytes: number): number => {

   const absoluteMb: number = bytes * (10 ** (-6));

   return Math.ceil(absoluteMb * 100) / 100;
}