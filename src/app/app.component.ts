import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor} from "@angular/material/button";
import {UserService} from "../services/user.service";
import {ProjectionService} from "../services/projection.service";
import {MovieService} from "../services/movieService";
import {AxiosError} from "axios";
import {ModelMovie} from "../model/model.movie";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbar, MatAnchor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    UserService.initUsers()
    let movies: ModelMovie[] = []
    MovieService.getMovies().then(rsp => {
      movies = rsp.data
      ProjectionService.initProjections(movies)
    })
    .catch((e: AxiosError) => console.log(`${e.code}: ${e.message}`));
  }

}
