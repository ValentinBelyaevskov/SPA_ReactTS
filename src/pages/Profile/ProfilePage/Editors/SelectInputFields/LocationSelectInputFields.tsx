import { FieldError } from 'react-hook-form'
import { City, Country, Language, LocationInputContext, Region, Territory, TerritoryType } from '../ChangeProfileInfoForm'
import LocationSelectElement from './LocationSelectElement'
import styles from './LocationSelectInputFields.module.scss'
import { defineLanguage } from '../../../../../functions/defineLanguage';
import { useContext } from 'react';



export type FormErrors = {
   [x: string]: FieldError
}

type Props = {
}



export type SetTerritoryFunctionName = "setCountry" | "setRegion" | "setCity"



const territoryTypes: TerritoryType[] = ["Country", "Region", "City"];



const LocationSelectInputFields = (props: Props) => {
   const context = useContext(LocationInputContext);



   const getAFunctionThatSetsTheLocationValue = (type: TerritoryType, setLocationFieldValue: React.Dispatch<React.SetStateAction<Country | Region | City>>) => (e: React.FormEvent, territoryType: TerritoryType): void => {
      if (e.target instanceof HTMLInputElement) {

         const territoryObject: Territory = {}
         const language: Language = territoryType === 'Country' ?
            defineLanguage(e.target.value)
            : context.locationInputLanguage;

         if (language) {
            territoryObject[`title_${language}`] = e.target.value;
            context.setLocationInputLanguage!(language);

         } else {
            territoryObject.title_ru = "";
            territoryObject.title_en = "";
            context.setLocationInputLanguage!(undefined);
            context.setLocationIds!({});
         }

         setLocationFieldValue(territoryObject);
      }
   }

   const getTerritoryFunctionName = (type: TerritoryType): SetTerritoryFunctionName => `set${type}`;



   return (
      <div className={styles.locationSelectInputFields}>
         {territoryTypes.map(type => (
            <LocationSelectElement
               key={type}
               setTerritoryOnInput={getAFunctionThatSetsTheLocationValue(type, context[getTerritoryFunctionName(type)]!)}
               setTerritory={context[getTerritoryFunctionName(type)]!}
               territory={context[type.toLowerCase()]}
               fieldName={type}
               territoryTypes={territoryTypes}
            />
         ))}
      </div>
   )
}



export default LocationSelectInputFields