// ?     en:       string.match(/[a-zA-Z]/g);
// ?     ru:       string.match(/[а-яА-Я]/g);
export const defineLanguage = (string: string): undefined | "ru" | "en" => {
   if (!string) return undefined

   const arrOfEnglishLetters: RegExpMatchArray | null = string.match(/[a-zA-Z]/g);
   const arrOfRussianLetters: RegExpMatchArray | null = string.match(/[а-яА-Я]/g);

   const numberOfEnglishLetters = arrOfEnglishLetters ? arrOfEnglishLetters.length : null;
   const numberOfRussianLetters = arrOfRussianLetters ? arrOfRussianLetters.length : null;


   return numberOfEnglishLetters && !numberOfRussianLetters ?
      "en"
      : !numberOfEnglishLetters && numberOfRussianLetters ?
         "ru"
         : undefined
}