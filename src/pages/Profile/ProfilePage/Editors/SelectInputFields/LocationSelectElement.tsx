import { City, Country, getTerritoryTitle, Language, LocationInputContext, Region, TerritoryType } from '../ChangeProfileInfoForm';
import styles from './LocationSelectInputFields.module.scss'
import { useState, useEffect, useCallback, useContext } from 'react';
import { defineLanguage } from 'functions/defineLanguage'
import ParameterSelectListItem from './ParameterSelectListItem';
import { TerritoryRequestParameters, useListOfTerritories, ResponceTerritoryObject } from './hooks/useListOfTerritories';
import { useElementEventHandlers } from 'hooks/useElementEventHandlers';



type Props = {
   setTerritoryOnInput: (e: React.FormEvent, territoryType: TerritoryType) => void
   setTerritory: React.Dispatch<React.SetStateAction<Country | Region | City>>
   fieldName: TerritoryType
   territory: Country | Region | City
   territoryTypes: TerritoryType[]
}



const LocationSelectElement = (props: Props) => {
   const context = useContext(LocationInputContext);
   const [fieldValueIsSet, setFieldValueIsSet] = useState<boolean>(true);
   const formFieldName: string = props.fieldName.toLowerCase();
   const [anInputEventHasOccurred, setAnInputEventHasOccurred] = useState<boolean>(false);
   const [fieldValue, setFieldValue] = useState<string>(getTerritoryTitle(props.territory, context.locationInputLanguage));
   const [disableRegionOrCountryInput, setDisableRegionOrCountryInput] = useState<boolean>(false);
   const touchAndClickEvents = useElementEventHandlers(['touchstart', 'touchmove', 'click'], () => setFieldValueIsSet(true), [`.${props.fieldName}SelectElement`]);
   const {
      listOfTerritories,
      showListOfTerritories,
      resetListOfTerritories,
      setShowListOfTerritories,
      getListOfTerritoriesWithDebounce
   } = useListOfTerritories(() => setAnInputEventHasOccurred(false));



   const inputListener = (e: React.FormEvent) => {
      if (fieldValueIsSet) setFieldValueIsSet(false);
      props.setTerritory({});
      props.setTerritoryOnInput(e, props.fieldName);
      setAnInputEventHasOccurred(true);
   }


   const getSelectedTerritory = (e: React.MouseEvent, listOfTerritories: ResponceTerritoryObject[], language: Language): ResponceTerritoryObject | undefined => (
      listOfTerritories.find(territory => {
         return (language && e.target instanceof Element) ?
            territory[`title_${language}`] === e.target.textContent
            : undefined
      })
   )

   const setTerritory = (selectedTerritory: ResponceTerritoryObject, formFieldName: string, locationInputLanguage: "en" | "ru") => {
      props.setTerritory(selectedTerritory);
      context.setValue!(formFieldName, selectedTerritory[`title_${locationInputLanguage}`], { shouldValidate: true });
   }

   const territoriesListItemClickHandler = useCallback((e: React.MouseEvent): void => {
      if (e.target instanceof Element && e.target.textContent) {
         const language = defineLanguage(e.target.textContent);
         const selectedTerritory = getSelectedTerritory(e, listOfTerritories, language);

         if (selectedTerritory && context.locationInputLanguage) {
            setTerritory(selectedTerritory, formFieldName, context.locationInputLanguage);
            setFieldValueIsSet(true);
         }
      }
   }, [listOfTerritories, formFieldName, context.locationInputLanguage, context.locationIds]);


   const inputKeyDownListener = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Tab') {
         setFieldValueIsSet(true);

         if (e.key === 'Enter') e.preventDefault();
      };
   }



   useEffect(() => {
      const language: Language = context.locationInputLanguage;
      let value: string | undefined = getTerritoryTitle(props.territory, context.locationInputLanguage);


      if (value) {
         if (props.fieldName === 'Country') context.setCountryFieldValue!(value);
      } else {
         if (props.fieldName === 'Country') context.setCountryFieldValue!("");
         value = "";
      }

      setFieldValue(value);

      
      if (listOfTerritories.length && language) {
         const aMatchWasFound = listOfTerritories.find(territory => territory[`title_${language}`] === value);

         if (aMatchWasFound) props.setTerritory(aMatchWasFound);
      }

   }, [listOfTerritories, props.fieldName, context.locationInputLanguage, props.territory.title_en, props.territory.title_ru]);


   useEffect(() => {
      if (!fieldValue.length) resetListOfTerritories();
      if ((!anInputEventHasOccurred || !fieldValue.length) && !fieldValueIsSet) return;

      const asyncEffect = async () => {
         const inputLanguage = defineLanguage(fieldValue);

         if (!inputLanguage) return;

         const territory: TerritoryRequestParameters = {
            language: inputLanguage,
            name: fieldValue,
            type: props.fieldName,
         }

         await getListOfTerritoriesWithDebounce(territory, context.locationIds!, props.territoryTypes);
      }

      asyncEffect();
   }, [fieldValueIsSet, fieldValue, props.fieldName, anInputEventHasOccurred, context.locationIds!.city_id, context.locationIds!.region_id, context.locationIds?.country_id]);


   useEffect(() => {
      const formFieldValue: string = context.getValues!()[props.fieldName.toLowerCase()];

      const disable: boolean = (props.fieldName !== 'Country' && !formFieldValue && !context.countryFieldValue) ?
         true
         : false;

      setDisableRegionOrCountryInput(disable);
   }, [props.fieldName, context.countryFieldValue, anInputEventHasOccurred]);


   useEffect(() => {
      const showList: boolean = (
         props.fieldName !== 'Country' && !context.locationIds!.country_id
      )
         || (
            !listOfTerritories
            || !listOfTerritories.length
            || !context.locationInputLanguage
         ) || fieldValueIsSet
         || (
            props.fieldName !== context.activeLocationField
         ) ?
         false
         : true;

      setShowListOfTerritories(showList);
   }, [fieldValueIsSet, context.activeLocationField, props.fieldName, context.locationIds!.country_id, listOfTerritories.length, context.locationInputLanguage]);


   useEffect(() => {
      if (showListOfTerritories) {
         touchAndClickEvents.removeEventListener();
         touchAndClickEvents.addEventListener();
      } else {
         touchAndClickEvents.enableEventSimulation();
      }
   }, [showListOfTerritories])



   return (
      <div className={styles.locationSelectElementContainer}>
         <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="">{props.fieldName}:</label>
            <input
               className={`${styles.input} ${props.fieldName}SelectElement`}
               type="text"
               {
               ...context.register!(
                  `${formFieldName}`,
                  {
                     maxLength: {
                        value: 250,
                        message: "Must be 250 characters or less"
                     },
                  }
               )
               }
               autoComplete="on"
               onInput={inputListener}
               onKeyDown={inputKeyDownListener}
               disabled={disableRegionOrCountryInput}
               onFocus={() => context.setActiveLocationField!(props.fieldName)}
            />
            <p className={styles.validationError}>{context.errors![formFieldName] ? context.errors![formFieldName].message : null}</p>
         </div>
         {
            showListOfTerritories ?
               <div className={`${styles.listOfTerritories} ${props.fieldName}SelectElement`}>
                  {listOfTerritories.map((territoryName, index) => (
                     <ParameterSelectListItem
                        fieldName={props.fieldName}
                        key={index}
                        styles={styles}
                        value={territoryName[`title_${context.locationInputLanguage ? context.locationInputLanguage : "en"}`]}
                        valuesListItemClickHandler={territoriesListItemClickHandler}
                     />
                  ))}
               </div>
               : null
         }
      </div>
   )
}



export default LocationSelectElement