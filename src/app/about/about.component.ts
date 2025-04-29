import { Component } from '@angular/core';
import {ProjectionService} from "../../services/projection.service";
import {ProjectionModel} from "../../model/projection/projection.model";
import {ModelMovie} from "../../model/model.movie";
import {MovieService} from "../../services/movieService";
import {AxiosError} from "axios";

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  public projections: ProjectionModel[] = []
  public movies: ModelMovie[] | null = null
  public error: string | null = null
  constructor() {
    MovieService.getMovies()
    .then(rsp => {
      this.movies = rsp.data
      ProjectionService.initProjections(this.movies!)
    })
    .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`)

  }
}
