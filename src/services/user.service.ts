import {ModelUser} from "../model/model.user";

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
        localStorage.setItem('active', user.email)
        this.loggedUser = user
        return true
      }
    }

    return false
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
        favouriteGenres: []
      }
    ]));
  }

  static getActiveUser(): ModelUser | null{
    if(localStorage.getItem('active')) return null

    return this.loggedUser
  }
}