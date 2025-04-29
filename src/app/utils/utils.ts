export class Utils{
  static localizeDate(dateString: string){
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat('sr-RS', options).format(date);
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