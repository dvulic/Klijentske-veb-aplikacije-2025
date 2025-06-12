import {ModelGenre} from "./model.genre";
import {CartItemModel} from "./cart/cartItem.model";

export interface ModelUser {
  firstName: string
  lastName: string
  //Contact
  email: string
  phoneNumber: string
  address: string
  //Data
  favouriteGenres: ModelGenre[] //Project requirement
  watchedMovies: number[]
  //Cart
  cartItems: CartItemModel[]
  password: string
}