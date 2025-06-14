import {HallModel} from "../model/projection/hall.model";
import {ProjectionModel} from "../model/projection/projection.model";
import {ModelMovie} from "../model/model.movie";
import {Utils} from "../app/utils/utils";
import {ProjectionSearchFilters} from "../model/projection/projectionSearchFilter.model";
import {Duration} from "../app/search/duration.enum";
import {GradesService} from "./grades.service";
import {GradeEnum} from "../app/search/grade.enum";

export class ProjectionService {
  //Use if no projections array is in LocalStorage, it will book
  static initProjections(movies: ModelMovie[]){
    const halls: HallModel[] = []

    for (let i = 1; i <= 11; i++){
      let hall: HallModel = new class implements HallModel {
        id = i;
        projections: ProjectionModel[] = [];
      };
      halls.push(hall)
    }

    //Initializing projections for current day and next 7 days
    const projections:ProjectionModel[] = []
    let startDate = new Date()//Today's date


    let projectionCounter = 1;
    for (let dayCount = 1; dayCount <= 7; dayCount++){//Days
         //Randomizing movie order and creating a deep copy
        let moviesCopy: ModelMovie[] = JSON.parse(JSON.stringify(movies));
        moviesCopy.sort(() => Math.random() - 0.5);

        for(let hall of halls){
          if(moviesCopy.length == 0) break

          let availableTime = 14 * 60 //14 hours available working time
          let currentDate = new Date(startDate.getTime())
          currentDate.setHours(10, 0, 0, 0)

          for (let movie of [...moviesCopy]) {
            let runtimeWithBreaks = movie.runTime + 20;
            if (runtimeWithBreaks > availableTime) continue;

            let projection: ProjectionModel = {
              Movie: movie,
              availableSeats: 60,
              date: Utils.localizeDate(currentDate.toLocaleDateString('eu-RS')),
              hallId: hall.id,
              id: projectionCounter,
              price: 500,
              time: currentDate.toLocaleTimeString('sr-RS'),
            };


            hall.projections.push(projection);
            projections.push(projection);

            moviesCopy = moviesCopy.filter(m => m !== movie); // safe remove

            availableTime -= runtimeWithBreaks;
            currentDate.setHours(currentDate.getHours() + Math.floor(runtimeWithBreaks / 60));
            currentDate.setMinutes(currentDate.getMinutes() + (runtimeWithBreaks % 60));
            projectionCounter++;
          }
        }
        startDate.setHours(10, 0, 0, 0)
        startDate.setDate(startDate.getDate() + 1)
    }

    // localStorage.setItem('halls', JSON.stringify(halls))
    localStorage.setItem('projections', JSON.stringify(projections))
  }

  static getDistinctProjectionDates(){
    if(localStorage.getItem('projections') === null) return []
    let projections: ProjectionModel[] = JSON.parse(localStorage.getItem('projections')!)

    return [...new Set(projections.map(p => p.date))];
  }

  static getProjections(){
    if(localStorage.getItem('projections') === null) return []

    let projections: ProjectionModel[] = JSON.parse(localStorage.getItem('projections')!)
    return projections
  }

  static getProjectionsForMovie(movieId: number, filterByTime?: boolean): ProjectionModel[] {
    if (localStorage.getItem('projections') === null) {
      return [];
    }

    let projections: ProjectionModel[] = JSON.parse(localStorage.getItem('projections')!);

    projections = projections.filter(p => p.Movie.movieId === movieId);

    if (!filterByTime) {
      return projections
    }

    const now = new Date();

    projections = projections.filter(projection => {
      const projectionDateTime = this.createDate(projection.date, projection.time)
      if(projectionDateTime !== null) return projectionDateTime > now;
      return
    })
    return projections
  }



  static searchProjections(filters: ProjectionSearchFilters): ProjectionModel[] {
    return this.getProjections().filter(p => {
      if (filters.searchedTitle && !p.Movie.title.toLowerCase().includes(filters.searchedTitle.toLowerCase())) return false;
      if (filters.selectedPrice && p.price != filters.selectedPrice) return false;

      if (filters.selectedDuration !== Duration.All) {
        const isShort = p.Movie.runTime < 120;
        if (filters.selectedDuration === Duration.Short && !isShort) return false;
        if (filters.selectedDuration === Duration.Long && isShort) return false;
      }

      if (filters.selectedReleaseDate && p.Movie.startDate !== filters.selectedReleaseDate) return false;
      if (filters.selectedDate && p.date !== filters.selectedDate) return false;
      if (filters.selectedTime && filters.selectedTime.length && !filters.selectedTime.includes(p.time)) return false;

      //Some actors
      if (filters.selectedActors.length && !p.Movie.movieActors.some(a =>
          filters.selectedActors.some(id => id.actorId === a.actor.actorId))) return false;

      //All selected actors
      // if (filters.selectedActors.length && !filters.selectedActors.every(id =>
      //     p.Movie.movieActors.some(a => a.actor.actorId === id.actorId))) return false;

      if (filters.selectedDirector && filters.selectedDirector.directorId !== (p.Movie.director.directorId)) return false;

      if(filters.selectedReview
          && filters.selectedReview !== GradeEnum.GR_1
          && filters.selectedReview > GradesService.getAverageGrade(undefined, p.Movie.movieId)
      ) return false;

      if (filters.selectedGenres.length && !filters.selectedGenres.every(id =>
          p.Movie.movieGenres.some(g => g.genreId === id.genreId))) return false;

      return true;
    });
  }

  private static createDate(datestring : string, timestring: string): Date | null{
    const dateParts = datestring.split('.').filter(p => p.trim() !== '');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    const timeParts = timestring.split(/:|\./);
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const second = parseInt(timeParts[2], 10);

    const projectionDateTime = new Date(year, month - 1, day, hour, minute, second);

    if (isNaN(projectionDateTime.getTime())) {
      console.error("Could not create a valid date from:", datestring);
      return null;
    }

    return projectionDateTime;
  }



}