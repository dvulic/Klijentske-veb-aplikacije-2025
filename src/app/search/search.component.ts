import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ModelMovie} from "../../model/model.movie";
import {MovieService} from "../../services/movieService";
import {AxiosError} from "axios";
import {MatFormField, MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from "@angular/material/input";
import {ModelGenre} from "../../model/model.genre";
import {Utils} from "../utils/utils";
import {ModelDirector} from "../../model/model.director";
import {ModelActor} from "../../model/model.actor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {ProjectionService} from "../../services/projection.service";
import {Duration} from "./duration.enum";
import {MatButton} from "@angular/material/button";
import {ProjectionModel} from "../../model/projection/projection.model";
import {ProjectionSearchFilters} from "../../model/projection/projectionSearchFilter.model";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {GradeEnum} from "./grade.enum";
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-search',
  imports: [
    NgForOf,
    MatFormField,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatSelectModule,
    MatInput,
    FormsModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    MatButton,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    RouterLink,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent{
  public movies: ModelMovie[] | null = null

  searchedTitle: string | null = null
  selectedDuration: Duration = Duration.All
  selectedReleaseDate: string | null = null
  selectedPrice: number | null = null
  selectedReview: GradeEnum | null = null
  public genres: ModelGenre[] | null = null
  public selectedGenres: ModelGenre[] = []
  public directors: ModelDirector[] | null = null
  public selectedDirector: ModelDirector | null = null
  public actors: ModelActor[] | null = null
  public selectedActors: ModelActor[] = []
  public projectionDates: string[] = []
  public selectedDate: string | null = null
  public projectionTimes: string[] = []
  public selectedTime: string[] | null = null
  public msdArray: [string, number][] | null = null
  public error : string | null = null
  //Table
  displayedColumns: string[] = ['title', 'hall', 'date', 'time', 'action'];
  dataSource = new MatTableDataSource<ProjectionModel>([]);

  constructor() {
    MovieService.getMovies()
    .then(rsp => {
      this.movies = rsp.data;

      this.msdArray = this.getDistinctReleaseDates(this.movies)
      this.projectionDates = ProjectionService.getDistinctProjectionDates()
    })
    .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);

    MovieService.getGenres()
    .then(rsp => this.genres = rsp.data)
    .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);

    MovieService.getDirectors()
    .then(rsp => {
      this.directors = rsp.data
      this.directors!.sort((a, b) => a.name.localeCompare(b.name));
    })
    .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);

    MovieService.getActors()
    .then(rsp => {
      this.actors = rsp.data;
      this.actors!.sort((a, b) => a.name.localeCompare(b.name));
    })
    .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);
  }

  onDateChange(date: string): void {
    this.projectionTimes = [...new Set(
        ProjectionService.getProjections()
        .filter(p => p.date === date)
        .map(p => p.time)
    )].sort();
  }

  resetFilters(): void {
    this.searchedTitle = null;
    this.selectedPrice = null;
    this.selectedDuration = Duration.All;
    this.selectedReleaseDate = null;
    this.selectedDate = null;
    this.selectedTime =null;
    this.selectedActors = [];
    this.selectedDirector = null;
    this.selectedGenres = [];
    this.selectedReview = null;

    this.dataSource.data = []
  }


  onSubmit(){
    const filters: ProjectionSearchFilters = {
      searchedTitle: this.searchedTitle,
      selectedPrice: this.selectedPrice,
      selectedDuration: this.selectedDuration,
      selectedReleaseDate: this.selectedReleaseDate,
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      selectedActors: this.selectedActors,
      selectedDirector: this.selectedDirector,
      selectedGenres: this.selectedGenres,
      selectedReview: this.selectedReview
    };

    this.dataSource.data = ProjectionService.searchProjections(filters)
  }

  private getDistinctReleaseDates(movies: ModelMovie[] | null): [string, number][] | null{
    if(movies === null) return null
    if(this.movies === null) return null

    // Assigning distinct dates
    let movieStartDates = new Map();

    for (let movie of this.movies) {
      if (!movieStartDates.has(movie.startDate)) {
        movieStartDates.set(movie.startDate, 1);
      } else {
        movieStartDates.set(movie.startDate, movieStartDates.get(movie.startDate)! + 1);
      }
    }

    // Turn this to array for easier access
    return Array.from(movieStartDates);
  }

  protected readonly console = console;

  protected readonly Utils = Utils;
  protected readonly Duration = Duration;
  protected readonly GradeEnum = GradeEnum;
}