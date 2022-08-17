import styles from "./Editor.module.scss";
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { profileActions, getProfileInfo, getLoadInfo, update } from '../../redux/profileReducer';
import { useForm, SubmitHandler, FieldError, UseFormRegister, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { removeExtraSpaces } from "../../../../functions";
import Backendless from 'backendless';
import { Button } from "../../../../common";
import { usePopupForm } from "hooks/usePopup/usePopupForm";
import DateSelectInputFields from "./SelectInputFields/DateSelectInputFields";
import React, { useState } from 'react';
import { IconsThatAreLoaded } from "common/IconsThatAreLoaded/IconsThatAreLoaded";
import LocationSelectInputFields from "./SelectInputFields/LocationSelectInputFields";
import { defineLanguage } from '../../../../functions/defineLanguage';
import { useEffect } from 'react';



type Props = {
   finishShowingThePopup: () => void,
}

export interface Territory {
   title_en?: string
   title_ru?: string
   country_id?: number
}

export interface Country extends Territory {
}

export interface Region extends Territory {
   region_id?: number
}

export interface City extends Region {
   city_id?: number
}

export type LocationIds = {
   country_id?: number
   region_id?: number
   city_id?: number
   [key: string]: number | undefined
}

export type Inputs = {
   firstName: string,
   lastName: string,
   email: string,
   country: string,
   region: string,
   city: string,
   education: string,
   dateOfBirth: string,
   [key: string]: string,
}

type ArrowIcon = "./icons/arrowUp.svg" | "./icons/arrowDown.svg"

export type Language = "en" | "ru" | undefined

export type TerritoryType = "Country" | "Region" | "City"

type FormErrors = {
   [x: string]: FieldError
}

export type LocationInputCtxt = {
   errors?: FormErrors
   register?: UseFormRegister<Inputs>
   setValue?: UseFormSetValue<Inputs>
   country?: Country
   setCountry?: React.Dispatch<React.SetStateAction<Country>>
   region?: Region
   setRegion?: React.Dispatch<React.SetStateAction<Region>>
   city?: City,
   setCity?: React.Dispatch<React.SetStateAction<City>>
   locationInputLanguage?: Language
   setLocationInputLanguage?: React.Dispatch<React.SetStateAction<Language>>
   locationIds?: LocationIds
   setLocationIds?: React.Dispatch<React.SetStateAction<LocationIds>>
   countryFieldValue?: string
   setCountryFieldValue?: React.Dispatch<React.SetStateAction<string | undefined>>
   getValues?: UseFormGetValues<Inputs>
   activeLocationField?: TerritoryType
   setActiveLocationField?: React.Dispatch<React.SetStateAction<TerritoryType | undefined>>
   [key: string]: any
}



const icons: ArrowIcon[] = [
   "./icons/arrowUp.svg",
   "./icons/arrowDown.svg",
];

export const LocationInputContext = React.createContext<LocationInputCtxt>({});

export const getTerritoryTitle = (territory: Territory, language: Language): string => {
   if (language) {
      const title = territory[`title_${language}`]
      return title ? title : ""
   } else {
      return ""
   }
}



const ChangeProfileInfoForm = (props: Props) => {
   const dispatch = useAppDispatch();
   const profile = useAppSelector(getProfileInfo);
   const loadInfo = useAppSelector(getLoadInfo);
   const popupForm = usePopupForm(props.finishShowingThePopup);
   const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);
   const [dayOfBirth, setDayOfBirth] = useState<string>(profile.dateOfBirth ? profile.dateOfBirth.split(" ")[1].slice(0, -1) : "");
   const [mounthOfBirth, setMounthOfBirth] = useState<string>(profile.dateOfBirth ? profile.dateOfBirth.split(" ")[0] : "");
   const [yearOfBirth, setYearOfBirth] = useState<string>(profile.dateOfBirth ? profile.dateOfBirth.split(" ")[2] : "");
   const [locationInputLanguage, setLocationInputLanguage] = useState<Language>(defineLanguage(profile.country));
   const [country, setCountry] = useState<Country>(setTerritoryDefaultValue(profile.country));
   const [region, setRegion] = useState<Region>(setTerritoryDefaultValue(profile.region));
   const [city, setCity] = useState<City>(setTerritoryDefaultValue(profile.city));
   const [locationIds, setLocationIds] = useState<LocationIds>({});
   const [countryFieldValue, setCountryFieldValue] = useState<string | undefined>();
   const [activeLocationField, setActiveLocationField] = useState<TerritoryType | undefined>();



   const { register, setValue, handleSubmit, getValues, formState: { errors, isValid } } = useForm<Inputs>({
      mode: "onBlur",
      defaultValues: {
         firstName: profile.firstName,
         lastName: profile.lastName,
         email: profile.email,
         education: profile.education,
         country: getTerritoryTitle(country, locationInputLanguage),
         region: getTerritoryTitle(region, locationInputLanguage),
         city: getTerritoryTitle(city, locationInputLanguage),
         dayOfBirth,
         mounthOfBirth,
         yearOfBirth,
      }
   })

   const onSubmit: SubmitHandler<Inputs> = data => {
      dispatch(profileActions.setLoadInfo({
         ...loadInfo,
         loaded: false,
         loading: true,
      }))

      const editedData = { ...new Backendless.User() };

      for (let key in data) {
         if (key !== "dateOfBirth") {
            editedData[key as keyof Backendless.User] = removeExtraSpaces(data[key])
         }
         if (key === "region" || key === "city") {
            if (!countryFieldValue) editedData[key as keyof Backendless.User] = ""
         }
      }

      dispatch(update({
         profile: {
            ...editedData,
            objectId: profile.objectId,
            dateOfBirth: `${mounthOfBirth} ${dayOfBirth}, ${yearOfBirth}`
         },
         callback: popupForm.hideEditorStyle,
      }))
   }

   const locationInputContext: LocationInputCtxt = {
      errors,
      country,
      locationIds,
      locationInputLanguage,
      region,
      city,
      countryFieldValue,
      activeLocationField,
      setValue,
      register,
      setCity,
      setCountry,
      setLocationIds,
      setLocationInputLanguage,
      setRegion,
      setCountryFieldValue,
      getValues,
      setActiveLocationField
   }



   function setTerritoryDefaultValue(defaultValue: string): Territory {
      return defaultValue ? { title_en: defaultValue, title_ru: defaultValue } : {}
   }



   useEffect(() => {
      const ids: (["country_id" | "region_id" | "city_id", number | undefined])[] = [
         ["country_id", country.country_id],
         ["region_id", region.region_id ? region.region_id : city.region_id],
         ["city_id", city.city_id]
      ];

      const idsObject: LocationIds = {}

      ids.forEach(id => {
         if (id[1]) idsObject[id[0]] = id[1]
      })

      setLocationIds({ ...idsObject });

   }, [country.country_id, region.region_id, city.city_id])



   return (
      <div style={popupForm.editorStyle} onTransitionEnd={popupForm.transitionEndListener} className={`${styles.editor} ${styles.changeProfileInfoEditor} editor`}>
         {
            iconsLoaded ?
               <div className={`${styles.changeProfileInfoFormContainer} ${styles.formContainer}`}>
                  {
                     loadInfo.loading && (
                        <div className={styles.preloaderContainer}>
                           <div className={styles.preloaderSubContainer}>
                              <img src="./animatedIcons/preloader2_white.svg" alt="preloader" />
                           </div>
                        </div>
                     )
                  }
                  <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                     <h2 className={styles.title}>
                        Edit profile information
                     </h2>
                     <div className={styles.inputFields}>
                        <label className={styles.label} htmlFor="userFirstName">First name:</label>
                        <input
                           className={styles.input}
                           type="text"
                           {
                           ...register(
                              "firstName",
                              {
                                 maxLength: {
                                    value: 40,
                                    message: "Must be 40 characters or less"
                                 },
                                 minLength: {
                                    value: 4,
                                    message: "Must be 4 characters or more"
                                 },
                                 required: "Required",
                              }
                           )
                           }
                           autoComplete="on"
                        />
                        <p className={styles.validationError}>{errors.userFirstName ? errors.userFirstName.message : null}</p>


                        <label className={styles.label} htmlFor="userLastName">Last name:</label>
                        <input
                           className={styles.input}
                           type="text"
                           {
                           ...register(
                              "lastName",
                              {
                                 maxLength: {
                                    value: 40,
                                    message: "Must be 40 characters or less"
                                 },
                                 minLength: {
                                    value: 4,
                                    message: "Must be 4 characters or more"
                                 },
                                 required: "Required",
                              }
                           )
                           }
                           autoComplete="on"
                        />
                        <p className={styles.validationError}>{errors.userLastName ? errors.userLastName.message : null}</p>


                        <label className={styles.label} htmlFor="email">Email:</label>
                        <input
                           className={styles.input}
                           type="text"
                           {
                           ...register(
                              "email",
                              {
                                 maxLength: {
                                    value: 250,
                                    message: "Must be 250 characters or less"
                                 },
                                 required: "Required",
                              }
                           )
                           }
                           autoComplete="on"
                        />
                        <p className={styles.validationError}>{errors.email ? errors.email.message : null}</p>


                        <label className={styles.label} htmlFor="dateOfBirth">Date of birth:</label>
                        <DateSelectInputFields
                           setDayOfBirth={setDayOfBirth}
                           setMounthOfBirth={setMounthOfBirth}
                           setYearOfBirth={setYearOfBirth}
                        />
                        <p className={styles.validationError}>{errors.dateOfBirth ? errors.dateOfBirth.message : null}</p>


                        <label className={styles.label} htmlFor="education">Education:</label>
                        <input
                           className={styles.input}
                           type="text"
                           {
                           ...register(
                              "education",
                              {
                                 maxLength: {
                                    value: 250,
                                    message: "Must be 250 characters or less"
                                 },
                                 required: false,
                              }
                           )
                           }
                           autoComplete="on"
                        />
                        <p className={styles.validationError}>{errors.education ? errors.education.message : null}</p>


                        <label className={styles.label} htmlFor="location">Location:</label>
                        <LocationInputContext.Provider value={locationInputContext}>
                           <LocationSelectInputFields />
                        </LocationInputContext.Provider>


                        {
                           loadInfo.error ? <div className={`${styles.warning} ${styles.errorWarning}`}>{`${loadInfo.error}`}</div>
                              : null
                        }
                     </div>
                     <div className={styles.buttons}>
                        <Button
                           params={
                              {
                                 containerClassName: `saveButtonContainer ${styles.formButtonContainer}`,
                                 clickListener: popupForm.setClickedButtonName,
                                 text: "Save",
                                 type: "submit",
                                 disabled: !isValid,
                                 buttonClassName: `${styles.formButton} saveButton`,
                                 changeStyleOnHover: true
                              }
                           }
                        />
                        <Button
                           params={
                              {
                                 containerClassName: `closeButtonContainer ${styles.formButtonContainer}`,
                                 clickListener: (e) => { popupForm.hideEditorStyle(); popupForm.setClickedButtonName(e) },
                                 text: "Close",
                                 type: "button",
                                 buttonClassName: `${styles.formButton} closeButton`,
                                 changeStyleOnHover: true
                              }
                           }
                        />
                     </div>
                  </form>
               </div>
               : null
         }
         <IconsThatAreLoaded icons={icons} setIconsLoaded={setIconsLoaded} />
      </div>
   )
}



export default ChangeProfileInfoForm