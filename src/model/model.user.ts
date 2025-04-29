import {ModelGenre} from "./model.genre";

export interface ModelUser {
  firstName: string
  lastName: string
  //Contact
  email: string
  phoneNumber: string
  address: string
  //Data
  favouriteGenres: ModelGenre[] //Project requirement

  password: string
}