import { DateObjects, DateStrings } from "./getFormattedDate";


export const getDialogDate = (dateObjects: DateObjects, dateStrings: DateStrings) => {
   if (dateObjects.civilPostDate.year < dateObjects.now.getFullYear()) {
      return `${dateStrings.date} ${dateStrings.year}`;
   } else if ((dateObjects.now.getMonth() > dateObjects.date.getMonth()) ||
      ((dateObjects.now.getDate() - dateObjects.date.getDate() >= 2) &&
         (dateObjects.now.getMonth() == dateObjects.date.getMonth()))) {
      return dateStrings.date;
   } else if (dateObjects.now.getMonth() == dateObjects.date.getMonth() &&
      dateObjects.now.getDate() - dateObjects.date.getDate() >= 1) {
      return "yesterday";
   } else if (dateObjects.differenceMs <= 24 * 60 * 60 * 1000) {
      return dateStrings.time;
   }
}