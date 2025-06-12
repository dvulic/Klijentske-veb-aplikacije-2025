import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public email: string = ''
  public password: string = ''

  constructor(private router: Router) {

  }

  public login(){
    const res = UserService.login(this.email, this.password)
    if(res){
      this.router.navigate(['/'])
      return
    }
    else{
      Swal.fire({
        title: 'Greška',
        text: 'Prijava neuspela. Proverite podatke i pokušajte ponovo.',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true
      });
    }
  }
}
