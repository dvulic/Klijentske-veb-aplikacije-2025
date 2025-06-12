import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModelMovie} from "../../model/model.movie";
import {MovieService} from "../../services/movieService";
import {AxiosError} from "axios";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Utils} from "../utils/utils";
import {SafePipe} from '../utils/safe.pipe';
import {APIGradeModel} from "../../model/APIGrade.model";
import {GradesService} from "../../services/grades.service";
import {LocalGradeModel} from "../../model/localGrade.model";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {ProjectionService} from "../../services/projection.service";
import {ProjectionModel} from "../../model/projection/projection.model";
import {CartItemModel} from "../../model/cart/cartItem.model";
import {TicketstatusEnum} from "../../model/cart/ticketstatus.enum";
import {CartService} from "../../services/cart.service";
import {MatDivider} from "@angular/material/divider";
import Swal from "sweetalert2";
import {TrailerService} from "../../services/trailer.service";
import {OmdbService} from "../../services/omdb.service";
import {MatChip, MatChipSet} from "@angular/material/chips";


@Component({
  selector: 'app-details',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatProgressSpinner,
    NgIf,
    SafePipe,
    NgForOf,
    MatButton,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    ReactiveFormsModule,
    MatOption,
    MatOption,
    MatSelect,
    MatDivider,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class DetailsComponent {
  public providedShortUrl = ''
  public movie: ModelMovie | null = null
  public trailer: string | null = null
  public grades: APIGradeModel | null = null
  public localGrades: LocalGradeModel[] | null = null
  public localGradeAverage: number | null = null
  public newComment: string = ''
  public newGrade: number = 0
  //Cart
  availableProjections: ProjectionModel[] | null = null
  ticketForm: FormGroup
  hallNumber: number | null = null
  selectedProjection: ProjectionModel | null = null
  numberOfTickets: number | null = null
  totalPrice: number | null = null
  public error : string | null = null


  constructor(private route: ActivatedRoute, fb: FormBuilder) {
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

      //Movie omdb grades
      OmdbService.getMovieGrades(this.movie.originalTitle, Utils.extractYear(this.movie.startDate))
      .then(r => {
        this.grades = r.data
        this.grades?.otherRatings.shift()
      })
      //Local grades
      this.localGrades = GradesService.getMovieGradesData(this.movie.movieId)
      if(this.localGrades.length > 0)
        this.localGradeAverage = GradesService.getAverageGrade(this.localGrades)

      //Ticket form
      this.availableProjections = ProjectionService.getProjectionsForMovie(this.movie.movieId, true);

    })
    .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);

    this.ticketForm = fb.group({
      numberOfTickets: [1],
      selectedProjection: [null]
    });
  }

  filterUpcomingProjections() {
    if(!this.availableProjections) return []
    const now = new Date();

    return this.availableProjections.filter(projection => {
      const projectionDateTime = new Date(`${projection.date}T${projection.time}`);
      return projectionDateTime > now;
    });
  }


  submitComment(){
    if (!this.newGrade
        || !this.newComment.trim()
        || !this.movie
    ) {
      Swal.fire({
        title: 'Greška',
        text: 'Komentar i ocena ne smeju biti prazni!',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    const user = UserService.getActiveUser()
    if(!user) {
      Swal.fire({
        title: 'Info',
        text: 'Molimo vas da se prijavite kako bi ste ostavili komentar.',
        icon: 'info',
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    if(this.movie && user.watchedMovies.filter(i => i === this.movie?.movieId).length == 0){
      Swal.fire({
        title: 'Info',
        text: 'Možete ocenjivati samo filmove koje ste prethodno pogledali.',
        icon: 'info',
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    const newLocalGrade = {
      movieId: this.movie.movieId,
      user: user,
      grade: this.newGrade,
      comment: this.newComment
    };

    GradesService.addNewGrade(newLocalGrade)
    if(this.localGrades) {
      this.localGrades.unshift(newLocalGrade)
    }
    else {
      this.localGrades = GradesService.getMovieGradesData(this.movie.movieId)
    }
    this.localGradeAverage = GradesService.getAverageGrade(this.localGrades!)


    this.newComment = '';
    this.newGrade = 0;
  }

  //Ticket funcs
  addToCart(){
    let user = UserService.getActiveUser()

    if(!user) {
      Swal.fire({
        title: 'Upozorenje',
        text: 'Neophodno je da se ulogujete.',
        icon: 'warning',
        timer: 3000,
        timerProgressBar: true
      });
      return
    }

    if(!this.ticketForm) return;
    if(!this.ticketForm.get('selectedProjection')?.value){
      Swal.fire({
        title: 'Upozorenje',
        text: 'Neophodno je da izaberete projekciju.',
        icon: 'warning',
        timer: 3000,
        timerProgressBar: true
      });
      return
    }

    let cartItem: CartItemModel = new class implements CartItemModel {
      CartItemId: number = 0;
      hallId: number = 0;
      movieTitle: string = '';
      movieId: number = 0;
      numberOfTickets: number = 1;
      pricePerTicket: number = 1;
      projectionDate: string = '';
      projectionId: number = 1;
      projectionTime: string = '';
      ticketPriceSum: number = 1;
      ticketStatus: TicketstatusEnum = TicketstatusEnum.reserved;
      userEmail: string = ''
    }

    const selectedProjection: ProjectionModel = this.ticketForm.get('selectedProjection')?.value!

    cartItem.CartItemId = user.cartItems.length > 0 ? Math.max(...user.cartItems.map(item => item.CartItemId)) + 1 : 1;
    cartItem.hallId = selectedProjection.hallId
    cartItem.movieTitle = selectedProjection.Movie.title
    cartItem.movieId = selectedProjection.Movie.movieId
    cartItem.numberOfTickets = this.ticketForm.get('numberOfTickets')?.value!
    cartItem.pricePerTicket = selectedProjection.price
    cartItem.projectionDate = selectedProjection.date
    cartItem.projectionTime = selectedProjection.time
    cartItem.ticketPriceSum = cartItem.pricePerTicket * cartItem.numberOfTickets
    cartItem.userEmail = user.email
    cartItem.ticketStatus = TicketstatusEnum.reserved

    CartService.addToCart(cartItem)
  }

  onProjectionChange(projection: ProjectionModel) {
    this.selectedProjection = projection;
    this.hallNumber = projection.hallId

    this.onTicketCountChange()
    // this.ticketForm.get('selectedProjection')?.setValue(projection);
  }

  onTicketCountChange(){
    const ticketCount = this.ticketForm.get('numberOfTickets')?.value;
    this.numberOfTickets = ticketCount
    if(this.selectedProjection)
      this.totalPrice = ticketCount * this.selectedProjection.price
  }

  protected readonly Utils = Utils;
}
