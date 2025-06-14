export class Utils{
  static localizeDate(dateString: string){

    if (dateString.includes("/")) { //Stupid chrome edge case because it can't parse dd.mm.yyyy
      const parts = dateString.split('/');

      let year, month, day;
      if (parts[0].length === 4) {
        [year, month, day] = parts;
      } else if (parts[2].length === 4) {
        [day, month, year] = parts;
      }
      dateString = `${year}-${month}-${day}`;
    }
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    const formatted = new Intl.DateTimeFormat('sr-RS', options).format(date);
    return formatted;
  }

  static extractYear(dateString: string): number {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return -1 // Invalid date
    }

    return date.getFullYear();
  }

  static formatMovieDuration(duration: number){
    let hours = Math.floor(duration / 60)
    let minutes = duration - (hours * 60)

    return `${hours}č ${minutes}min`
  }
}