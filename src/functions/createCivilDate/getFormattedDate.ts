import getCivilDate from "./getCivilDate";
import { getPostDate } from "./getPostDate";
import { getDialogDate } from "./getDialogDate";
import { getMessageDate } from "./getMessageDate";


export type ContentType = "posts" | "dialog" | "message"

export type DateObjects = {
   now: Date,
   date: Date,
   differenceMs: number,
   civilPostDate: any,
   havePassed: {
      minutes: number,
      hours: number,
   }
}

export type DateStrings = {
   time: string
   date: string
   year: string
}


const getFormattedDate = (dateStr: number, contentType: ContentType) => {
   const dateObjects: DateObjects = {
      now: new Date(),
      date: new Date(dateStr),
      differenceMs: new Date().getTime() - new Date(dateStr).getTime(),
      civilPostDate: getCivilDate(dateStr),
      havePassed: {
         minutes: new Date().getMinutes() < new Date(dateStr).getMinutes() ? ((new Date().getMinutes() + 60) - new Date(dateStr).getMinutes()) : (new Date().getMinutes() - new Date(dateStr).getMinutes()),
         hours: new Date().getHours() < new Date(dateStr).getHours() ? ((new Date().getHours() + 24) - new Date(dateStr).getHours()) : (new Date().getHours() - new Date(dateStr).getHours()),
      }
   }

   const dateStrings: DateStrings = {
      time: `${dateObjects.civilPostDate.hours}:${dateObjects.civilPostDate.minutes} ${dateObjects.civilPostDate.amOrPm}`,
      date: `${dateObjects.civilPostDate.day} ${dateObjects.civilPostDate.month}`,
      year: `${dateObjects.civilPostDate.year}`,
   }

   if (contentType === "posts") {
      return getPostDate(dateObjects, dateStrings);
   } else if (contentType === "dialog") {
      return getDialogDate(dateObjects, dateStrings);
   } else if (contentType === "message") {
      return getMessageDate(dateObjects, dateStrings);
   }
}

export default getFormattedDate;