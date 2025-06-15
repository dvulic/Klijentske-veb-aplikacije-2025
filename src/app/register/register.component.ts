import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {ModelGenre} from "../../model/model.genre";
import {CartItemModel} from "../../model/cart/cartItem.model";
import Swal from "sweetalert2";


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


  validateEntries(): boolean {
    const isEmpty = (str: string | null | undefined) => !str || str.trim().length === 0;

    if (isEmpty(this.firstName) ||
        isEmpty(this.lastName) ||
        isEmpty(this.email) ||
        isEmpty(this.phoneNumber) ||
        isEmpty(this.address) ||
        isEmpty(this.password)) {
      return false;
    }

    if (this.password && this.password.length < 3) {
      return false;
    }
    return true;
  }

  onSubmit() {
    if(!this.validateEntries()){
      Swal.fire({
        title: 'Greška',
        text: 'Registracija neuspela. Proverite podatke i pokušajte ponovo.',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true
      });
      return
    }
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
    Swal.fire({
      title: 'Uspesna prijava',
      text: 'Dobrodošli! Vaša priajva je uspešna i možete otići na stranu za prijavu.',
      icon: 'success',
      timer: 3000,
      timerProgressBar: true
    });
  }
}
