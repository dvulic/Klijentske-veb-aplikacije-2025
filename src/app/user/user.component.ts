import {Component} from '@angular/core';
import {ModelUser} from "../../model/model.user";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatOption, MatSelect} from '@angular/material/select';
import {MatInput, MatLabel} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModelGenre} from "../../model/model.genre";
import {MovieService} from "../../services/movieService";
import {NgForOf} from "@angular/common";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";


@Component({
  selector: 'app-user',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatOption,
    MatSelect,
    NgForOf,
    MatOption,
    MatSelect,
    MatCard,
    MatCardContent,
    MatCardTitle
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  user: ModelUser | null = null
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  oldEmail: string = '';
  phoneNumber: string = '';
  address: string = '';
  password: string = '';
  favouriteGenres: ModelGenre[] = []
  genresSource: ModelGenre[] | null = null

  constructor(private router: Router) {
    this.user = UserService.getActiveUser()
    if (!this.user) {
      this.router.navigate(['/login'])
      return
    }

    MovieService.getGenres()
    .then(r =>
      this.genresSource = r.data
    )

    this.oldEmail = this.user.email
    this.favouriteGenres.push(...this.user.favouriteGenres)
  }

  onSubmit(){
    if(!this.user) return;

    this.updateModel()
    let res = UserService.updateUser(this.oldEmail, this.user)
    console.log(res)
  }

  private updateModel(){
    if(!this.user) return

    if(this.firstName) this.user.firstName = this.firstName
    if(this.lastName) this.user.lastName = this.lastName
    if(this.email) this.user.email = this.email
    if(this.phoneNumber) this.user.phoneNumber = this.phoneNumber
    if(this.address) this.user.address = this.address
    if(this.password) this.user.password = this.password
    this.user.favouriteGenres = this.favouriteGenres
  }
}
