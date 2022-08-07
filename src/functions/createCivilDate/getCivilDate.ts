const getCivilDate = (dateString: number) => {
   const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
   const date = new Date(dateString);
   const dateObj = {
      year: date.getFullYear(),
      mounthNumber: date.getMonth(),
      month: months[date.getMonth()],
      day: date.getDate(),
      hours: date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
      numberMinutes: date.getMinutes(),
      minutes: date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`,
      amOrPm: date.getHours() > 12 ? "pm" : "am",
   };

   return dateObj;
}

export default getCivilDate;