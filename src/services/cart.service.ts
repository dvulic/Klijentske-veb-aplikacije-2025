import {CartItemModel} from "../model/cart/cartItem.model";
import {UserService} from "./user.service";
import {TicketstatusEnum} from "../model/cart/ticketstatus.enum";
import Swal from "sweetalert2";

export class CartService {
  static addToCart(item: CartItemModel){
    const user = UserService.getActiveUser()
    if(!user) return false

    user.cartItems.push(item) //Adding cart item

    //Updating both activeUser and users array
    localStorage.setItem('active', JSON.stringify(user))
    const users = UserService.getUsers()
    for(let u of users){
      if(u.email === item.userEmail){
        u.cartItems.push(item)
        localStorage.setItem('users', JSON.stringify(users))

        Swal.fire({
          title: 'Izvršeno',
          text: 'Projekcija je uspešno dodata u korpu!',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true
        });
        return true
      }
    }
    Swal.fire({
      title: 'Greška',
      text: 'Dodavanje projekcije u korpu nije uspelo!',
      icon: 'error',
      timer: 3000,
      timerProgressBar: true
    });
    return false
  }

  static removeFromCart(cartItemId: number){
    const user = UserService.getActiveUser()
    if(!user) return false

    const users = UserService.getUsers()
    for(let u of users){
      if(u.email === user.email){
        const index = u.cartItems.findIndex(item => item.CartItemId === cartItemId);
        if (index !== -1) {
          u.cartItems.splice(index, 1);
        }
        localStorage.setItem('active', JSON.stringify(u))
        localStorage.setItem('users', JSON.stringify(users))
        return true
      }
    }
    return false
  }

  static cancelReservation(cartItemId: number){
    const user = UserService.getActiveUser()
    if(!user) return false

    const users = UserService.getUsers()
    for(let u of users){
      if(u.email === user.email){
        const index = u.cartItems.findIndex(item => item.CartItemId === cartItemId);
        if(index === -1 || u.cartItems[index].ticketStatus !== TicketstatusEnum.reserved) return false

        u.cartItems[index].ticketStatus = TicketstatusEnum.cancelled
        localStorage.setItem('active', JSON.stringify(u))
        localStorage.setItem('users', JSON.stringify(users))
        return true
      }
    }
    return false
  }

  static payReservation(cartItemId: number){
    const user = UserService.getActiveUser()

    if(!user) return false

    const users = UserService.getUsers()
    for(let u of users){
      if(u.email === user.email){

        const index = u.cartItems.findIndex(item => item.CartItemId === cartItemId);
        console.log(index)
        console.log(u.cartItems[index].ticketStatus)
        if(index === -1 || u.cartItems[index].ticketStatus !== TicketstatusEnum.reserved) return false


        u.cartItems[index].ticketStatus = TicketstatusEnum.paid
        if(u.watchedMovies.filter((movieId) => u.cartItems[index].movieId === movieId).length === 0)
          u.watchedMovies.push(u.cartItems[index].movieId)

        localStorage.setItem('active', JSON.stringify(u))
        localStorage.setItem('users', JSON.stringify(users))

        return true
      }
    }
    return false
  }
}