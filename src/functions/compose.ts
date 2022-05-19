type Functions = (...args: any[]) => any


export const compose = (...functions: Functions[]): any =>
   (arg: any) => functions.reduceRight(
      (result: any, f) => f(result), 
      arg
   );