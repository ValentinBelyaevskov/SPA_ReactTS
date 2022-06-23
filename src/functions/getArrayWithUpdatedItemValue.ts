export const getArrayWithUpdatedItemValue = <T>(currentArrayValue: T[], itemIndex: number, newItemValue: T): T[] => {
   const copy = [...currentArrayValue];

   copy[itemIndex] = newItemValue;

   return copy
}