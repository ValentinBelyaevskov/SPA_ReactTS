import { useAppSelector } from "hooks/redux"
import DateSelectElement from "./DateSelectElement"
import styles from './DateSelectInputFields.module.scss'
import { getProfileInfo } from '../../../redux/profileReducer';



type DateNames = "Day" | "Mounth" | "Year"

type Props = {
   setDayOfBirth: React.Dispatch<React.SetStateAction<string>>
   setMounthOfBirth: React.Dispatch<React.SetStateAction<string>>
   setYearOfBirth: React.Dispatch<React.SetStateAction<string>>
}

type DateArrays = {
   [key: string]: string[] | number[]
}



const dateNames: DateNames[] = [
   "Day",
   "Mounth",
   "Year"
]

const mounths: string[] = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December"
];

const days: number[] = [];

const years: number[] = [];

const maxAgeVAlue: number = 100;

const thisYear: number = new Date().getFullYear()

for (let i = 1; i < 32; i++) {
   days[i] = i
}

for (let i = thisYear; i >= thisYear - maxAgeVAlue; i--) {
   years[thisYear - i] = i
}

const dateArrays: DateArrays = {
   days,
   mounths,
   years
}



const DateSelectInputFields = (props: Props) => {
   const profile = useAppSelector(getProfileInfo)
   const defaultValues = [
      profile.dateOfBirth ? profile.dateOfBirth.split(" ")[1].slice(0, -1) : "",
      profile.dateOfBirth ? profile.dateOfBirth.split(" ")[0] : "",
      profile.dateOfBirth ? profile.dateOfBirth.split(" ")[2] : ""
   ]


   return (
      <div className={styles.selectElementsContainer}>
         {dateNames.map((dateName, index) => (
            <DateSelectElement
               key={dateName}
               fieldName={dateName}
               valuesArr={dateArrays[`${dateName.toLowerCase()}s`]}
               defaultValue={defaultValues[index]}
               setDateValue={props[`set${dateName}OfBirth`]}
            />
         ))}
      </div>
   )
}

export default DateSelectInputFields