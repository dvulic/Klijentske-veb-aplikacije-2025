import {ModelUser} from "../model/model.user";
import Swal from "sweetalert2";

export class UserService {
  static loggedUser: ModelUser | null = null

  static getUsers(): ModelUser[] {
    // if (!localStorage.getItem('users')) {
    //   this.initUsers()
    // }

    return JSON.parse(localStorage.getItem('users')!);
  }


  static login(email: string, password: string): boolean{
    for (let user of this.getUsers()){
      if(user.email === email && user.password === password){
        localStorage.setItem('active', JSON.stringify(user))
        this.loggedUser = user
        return true
      }
    }

    return false
  }

  static logout(){
    localStorage.removeItem('active')
    this.loggedUser = null
  }

  static initUsers(){
    localStorage.setItem('users', JSON.stringify([
      {
        firstName: "Petar",
        lastName: "Petrovic",
        email: "ppetrovic@gmail.com",
        phoneNumber: "+38160123456",
        address: "Jevrejska 14",
        password: "123",
        favouriteGenres: [],
        watchedMovies: [],
        cartItems: []
      }
    ]));
  }

  static getActiveUser(): ModelUser | null{
    let activeUser = localStorage.getItem('active')
    if(!activeUser) return null

    return JSON.parse(activeUser)
  }

  static updateUser(oldEmail: string, updatedUser: ModelUser){
    const users: ModelUser[] = JSON.parse(localStorage.getItem('users') || '[]')
    if(users.length === 0) return false

    for(let user of users){
      if(user.email === oldEmail){

        user.email = updatedUser.email
        user.password = updatedUser.password
        user.firstName = updatedUser.firstName
        user.lastName = updatedUser.lastName
        user.address = updatedUser.address
        user.phoneNumber = updatedUser.phoneNumber
        user.favouriteGenres = updatedUser.favouriteGenres

        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('active', JSON.stringify(user))

        Swal.fire({
          title: 'Izvršeno',
          text: 'Izmene sačuvane!',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true
        });
        return true
      }
    }

    return false
  }
}