import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor} from "@angular/material/button";
import {UserService} from "../services/user.service";
import {ProjectionService} from "../services/projection.service";
import {MovieService} from "../services/movieService";
import {AxiosError} from "axios";
import {ModelMovie} from "../model/model.movie";
import {GradesService} from "../services/grades.service";
import {NgIf} from "@angular/common";
import {MatBadge} from "@angular/material/badge";
import {TicketstatusEnum} from "../model/cart/ticketstatus.enum";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbar, MatAnchor, NgIf, MatBadge],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    this._init()
  }

  private _init(){
    if(!localStorage.getItem('users')) UserService.initUsers()

    if(!localStorage.getItem('projections')){
      let movies: ModelMovie[] = []
      MovieService.getMovies().then(rsp => {
        movies = rsp.data.reverse() //Newest movies first
        ProjectionService.initProjections(movies)
      })
      .catch((e: AxiosError) => console.log(`${e.code}: ${e.message}`));
    }
    if(!localStorage.getItem('grades')) GradesService.initGrades()
  }

  get cartItemCount(): number {
    return this.UserService.getActiveUser()?.cartItems?.filter(item => item.ticketStatus === TicketstatusEnum.reserved).length || 0;
  }

  protected readonly UserService = UserService;
}
