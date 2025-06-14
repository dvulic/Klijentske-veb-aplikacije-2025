import { Component } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";
import {AxiosError} from "axios";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {ModelMovie} from "../../model/model.movie";
import {MovieService} from "../../services/movieService";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";
import {MatChip, MatChipListbox, MatChipSet} from "@angular/material/chips";
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-home',
  imports: [
    // JsonPipe,
    NgIf,
    NgFor,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinner,
    RouterLink,
    MatChipSet,
    MatChip,
    MatChipListbox,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public movies: ModelMovie[] | null = null
  public newestMovies: ModelMovie[] | null = null
  public error : string | null = null

  constructor() {
    MovieService.getMovies()
    .then(
        rsp => {
          this.movies = rsp.data

          if(this.movies == null) throw new Error("Movie data is not available.");
          const sortedMovies = [...this.movies].sort((a, b) => {
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          });

          this.movies = sortedMovies.splice(8, this.movies?.length)
          this.newestMovies = sortedMovies.slice(0, 8);
        }
    )
    .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`)
  }

}
