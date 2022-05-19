import { useDebounce } from "hooks/useDebounce";
import { useState } from "react";
import { Language, LocationIds, TerritoryType } from "../../ChangeProfileInfoForm";



export type ResponceTerritoryObject = {
   title_en: string
   title_ru: string
}

export type TerritoryTable = "Countries" | "Regions" | "Cities"

export type TerritoryRequestParameters = {
   name: string
   type: TerritoryType
   language: Language
}

type GetListOfTerritories = (territory: TerritoryRequestParameters, locationIds: LocationIds, territoryTypes: TerritoryType[]) => Promise<void | undefined>



export const useListOfTerritories = (functionToBeCalledAfterGettingTheList: () => void) => {
   const [listOfTerritories, setListOfTerritories] = useState<ResponceTerritoryObject[]>([]);
   const [showListOfTerritories, setShowListOfTerritories] = useState<boolean>(false);



   const getTableName = (type: TerritoryType): TerritoryTable => (
      type === 'Country' ?
         "Countries"
         : type === 'Region' ?
            "Regions"
            : "Cities"
   );

   const getIdQuery = (locationIds: LocationIds, type: TerritoryType, territoryTypes: TerritoryType[]): string => {
      let idQuery = "";
      const typeIndex = territoryTypes.findIndex(territoryType => territoryType === type);
      const queryTypes = territoryTypes.slice(0, typeIndex + 1).map(item => `${item.toLowerCase()}_id`);

      for (let key in locationIds) {
         if (locationIds[key] && queryTypes.includes(key)) {
            idQuery = `${idQuery} and ${key} = '${locationIds[key]}'`;
         }
      }

      return idQuery;
   }

   const getListOfTerritories = async (territory: TerritoryRequestParameters, locationIds: LocationIds, territoryTypes: TerritoryType[]): Promise<void | undefined> => {
      try {
         const idQuery: string = getIdQuery(locationIds!, territory.type, territoryTypes);

         const queryBuilder = await Backendless.DataQueryBuilder
            .create()
            .setWhereClause(`title_${territory.language} LIKE '${territory.name}%'${idQuery}`)
            .setPageSize(15);
         const request = await Backendless.Data.of(getTableName(territory.type)).find<ResponceTerritoryObject>(queryBuilder);

         setListOfTerritories(request);

         functionToBeCalledAfterGettingTheList();
      } catch (err: any) {
         console.log(err);
      }
   }

   const getListOfTerritoriesWithDebounce: GetListOfTerritories = useDebounce(getListOfTerritories, 1200);

   const resetListOfTerritories = () => setListOfTerritories([]);



   return {
      listOfTerritories,
      showListOfTerritories,
      resetListOfTerritories,
      setShowListOfTerritories,
      getListOfTerritoriesWithDebounce
   }
}