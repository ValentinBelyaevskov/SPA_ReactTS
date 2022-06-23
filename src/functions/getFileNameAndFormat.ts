const getFileNameAndFormat = (value: string): [string, string] => {
   const formatLength: number = value.split("").reverse().findIndex(item => item === ".");
   const valueWithoutMeasure: string = value.slice(0, -formatLength - 1);
   const measure: string = value.slice(-formatLength);

   return [valueWithoutMeasure, measure];
}

export default getFileNameAndFormat;