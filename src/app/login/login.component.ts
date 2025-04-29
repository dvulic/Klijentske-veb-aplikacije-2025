import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public email: string = ''
  public password: string = ''


  public login(){
    const res = UserService.login(this.email, this.password)
    if(res){
      //Redirect to user profile
    }
    else{
      alert("Bad information")
    }
  }
}
