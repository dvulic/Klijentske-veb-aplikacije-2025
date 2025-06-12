import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {ModelGenre} from "../../model/model.genre";
import {CartItemModel} from "../../model/cart/cartItem.model";


@Component({
  selector: 'app-register',
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatButton,
    MatLabel,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  address: string = '';
  password: string = '';
  favouriteGenres: ModelGenre[] = []
  watchedMovies: number[] = []
  cartItems: CartItemModel[] = []

  hidePassword: boolean = true;

  onSubmit() {
    let users = UserService.getUsers()
    users.push(
        {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          address: this.address,
          password: this.password,
          favouriteGenres: this.favouriteGenres,
          watchedMovies: this.watchedMovies,
          cartItems: this.cartItems
        }
    )

    localStorage.setItem('users', JSON.stringify(users))

  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
