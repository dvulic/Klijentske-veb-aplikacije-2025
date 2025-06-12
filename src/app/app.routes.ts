import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {SearchComponent} from "./search/search.component";
import {DetailsComponent} from "./details/details.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {UserComponent} from "./user/user.component";
import {CartComponent} from "./cart/cart.component";
import {LogoutComponent} from "./logout/logout.component";

export const routes: Routes = [
  {path: '', component : HomeComponent},
  {path : 'about', component : AboutComponent },
  {path : 'search', component : SearchComponent },
  {path : 'movie/:shortUrl', component: DetailsComponent},
  {path : 'login', component : LoginComponent },
  {path : 'logout', component : LogoutComponent },
  {path : 'register', component : RegisterComponent },
  {path : 'user', component : UserComponent },
  {path : 'cart', component : CartComponent },
  {path : '**', redirectTo: ''}
];
