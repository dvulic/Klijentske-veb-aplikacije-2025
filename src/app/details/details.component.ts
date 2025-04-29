import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModelMovie} from "../../model/model.movie";
import {MovieService} from "../../services/movieService";
import {AxiosError} from "axios";
import {MatCard, MatCardTitle, MatCardActions, MatCardContent, MatCardHeader, MatCardImage} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Utils} from "../utils/utils";
import {TrailerService} from "../../services/trailer.service";
import { SafePipe } from '../utils/safe.pipe';
import {OmdbService} from "../../services/omdb.service";
import {APIGradeModel} from "../../model/APIGrade.model";

@Component({
  selector: 'app-details',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardImage,
    MatCardTitle,
    MatProgressSpinner,
    NgIf,
    SafePipe,
    NgForOf,
    MatButton,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  public providedShortUrl = ''
  public movie: ModelMovie | null = null
  public trailer: string | null = null
  public grades: APIGradeModel | null = null
  public error : string | null = null

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params=>
      this.providedShortUrl = params['shortUrl']
    )

    MovieService.getMovieByShortUrl(this.providedShortUrl)
    .then(rsp => {
      this.movie = rsp.data;

      if(this.movie === null) return
      //Getting movie trailer
      TrailerService.getMovieTrailer(this.movie.originalTitle, Utils.extractYear(this.movie.startDate))
      .then(r => {
        this.trailer = TrailerService.getEmbedLink(r.data.videoId)
      })
      .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);
      //Movie grades
      OmdbService.getMovieGrades(this.movie.originalTitle, Utils.extractYear(this.movie.startDate))
      .then(r => {
        this.grades = r.data
        this.grades?.otherRatings.shift()
      })
    })
    .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);
  }

  protected readonly Utils = Utils;
}
